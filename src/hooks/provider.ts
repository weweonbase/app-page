import { ethers } from "ethers";

export const provider = new ethers.JsonRpcProvider(
    // `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_APIKEY}`
    // "https://base-mainnet.g.alchemy.com/v2/rjpyIU7l5bsXVQ8Ynwi7mdweCEWe3gmY"
    "https://base-mainnet.infura.io/v3/d92ab3de97fc461f923c45b1edfc1685"
);