pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract AITU is ERC721A, Ownable {
    struct TokenData {
        uint256 tokenId;
        uint256 timestamp;
        address owner;
    }

    mapping(uint256 => TokenData) public tokenData;

    uint256 MAX_MINTS = 20;
    uint256 MAX_SUPPLY = 500;
    uint256 tokensReserved = 10;
    uint256 public mintRate = 0.005 ether;
    uint public totalTokensMinted;

    string public baseExtenstion = ".json";
    string internal baseTokenUri;

    bool public publicMintOpen = false;

    mapping(address => bool) public whitelist;

    event TokensMinted(address indexed minter, uint256 quantity);
    event Airdropped(address indexed recipient, uint256 quantity);
    event MintRateUpdated(uint256 newRate);
    event PublicMintStatusChanged(bool newStatus);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor() ERC721A("AITU", "AITU"){}

    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        baseTokenUri = baseTokenUri_;
    }

    receive() external payable {}

    function _startTokenId() internal view override virtual returns (uint256) {
        return 1;
    }

    function tokenURI(uint256 tokenId_) public view override returns (string memory) {
        require(_exists(tokenId_), "Token does not exist");
        return string(abi.encodePacked(baseTokenUri, Strings.toString(tokenId_), ".json"));
    }

    function setMintRate(uint256 _mintRate) public onlyOwner {
        mintRate = _mintRate;
        emit MintRateUpdated(_mintRate);
    }

    function addToWhitelist(address user) external onlyOwner {
        whitelist[user] = true;
    }

    function removeFromWhitelist(address user) external onlyOwner {
        whitelist[user] = false;
    }

    function airdrop(address recipient, uint256 quantity) external onlyOwner {
        require(totalSupply() + quantity <= 20, "SOLD OUT!");
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(recipient, 1);
            totalTokensMinted++;
            tokenData[totalTokensMinted] = TokenData(totalTokensMinted, block.timestamp, recipient);
        }
        emit Airdropped(recipient, quantity);
    }

    function editMint(bool _publicMintOpen) external onlyOwner {
        publicMintOpen = _publicMintOpen;
        emit PublicMintStatusChanged(_publicMintOpen);
    }

    function mintOwner(uint256 quantity) public onlyOwner{
        require(totalSupply() + quantity <= MAX_SUPPLY, "SOLD OUT!");
        _safeMint(msg.sender, quantity);
        totalTokensMinted += quantity;
        tokenData[totalTokensMinted] = TokenData(totalTokensMinted, block.timestamp, msg.sender);
        emit TokensMinted(msg.sender, quantity);
    }

    function withdraw(address _addr) external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_addr).transfer(balance);
        emit Withdrawal(_addr, balance);
    }

    function mint(uint256 quantity) public payable {
        require(publicMintOpen, "Public Mint Closed");
        require(whitelist[msg.sender], "Not whitelisted");
        require(quantity + _numberMinted(msg.sender) <= MAX_MINTS, "Invalid quantity");
        require(totalSupply() + quantity <= (MAX_SUPPLY - tokensReserved), "SOLD OUT!");
        require(msg.value >= (mintRate * quantity), "not enough ether");
        _safeMint(msg.sender, quantity);
        totalTokensMinted += quantity;
        tokenData[totalTokensMinted] = TokenData(totalTokensMinted, block.timestamp, msg.sender);
        emit TokensMinted(msg.sender, quantity);
    }

    function getTotalTokensMinted() public view returns (uint256) {
        return totalTokensMinted;
    }
}