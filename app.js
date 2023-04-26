const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const contractAddress = 'CONTRACT_ADDRESS_HERE';
const abi = ABI_HERE;
const contract = new web3.eth.Contract(abi, contractAddress);

const checkBtn = document.querySelector('#check-btn');
const status = document.querySelector('#status');

checkBtn.addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const owner = accounts[0];

      // Check if owner owns the eligible domain
      const ensName = 'NNNNN.eth';
      const domainOwner = await contract.methods.ownerOf(web3.utils.sha3(ensName)).call();

      if (owner !== domainOwner) {
        status.textContent = 'Sorry, you do not own the eligible domain for this asset.';
        return;
      }

      // Try to claim the asset
      try {
        await contract.methods.claimAsset().send({ from: owner });
        status.textContent = 'Congratulations! You have claimed the soulbound asset.';
      } catch (error) {
        status.textContent = 'Sorry, something went wrong. Please try again later.';
      }

    } catch (error) {
      console.error(error);
      status.textContent = 'Sorry, something went wrong. Please try again later.';
    }
  } else {
    status.textContent = 'Please install Metamask to claim this soulbound asset.';
  }
});
