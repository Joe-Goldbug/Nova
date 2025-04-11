import { useState, useEffect } from "react";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { motion } from "framer-motion";
import { FiCopy, FiPackage, FiSearch } from "react-icons/fi";
import { useWallet } from "@solana/wallet-adapter-react";

const POPULAR_TOKEN_ADDRESSES = [
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "So11111111111111111111111111111111111111112", // SOL (Wrapped)
  "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", // Serum
  "MSRMcoVyrFxnSgo5uXwone5SKcGhT1KEJMFEkMEWf9L", // MSRM
  "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E", // BTC (Sollet)
  "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk", // ETH (Sollet)
  "AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3", // FIDA
  "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp", // FTT
  "MAPS41MDahZ9QdKXhVa4dWB9RuyfV4XqhyAZ8XcYepb", // MAPS
  "kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6", // KIN
  "7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx", // GMT
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", // ETH (Portal)
  "AUrMpCDYYcPuHhyNX8gEEqbmDPFUpBpHrNW3vPeCFn5Z", // AVAX (Portal)
  "DYKep6iA4F7xUXwLCD7H4b7BSqraR5rWPEv3DZJYZ8C3", // RAY
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", // RAYDIUM
  "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", // PYTH
  "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y", // Shadow Token
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", // SAMO
  "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", // ORCA
];

const CreatedTokens = ({
  activeSection,
}: {
  activeSection: "solana" | "ethereum";
}) => {
  const { publicKey } = useWallet();
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([]);
  const [publicTokens, setPublicTokens] = useState<TokenInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError("");

        const tokens = await new TokenListProvider().resolve();
        const mainnetTokens = tokens
          .filterByClusterSlug("mainnet-beta")
          .getList();

        const userTokens = publicKey
          ? mainnetTokens.filter(
              (token) =>
                //@ts-ignore
                token.extensions?.updateAuthority === publicKey.toBase58()
            )
          : [];

        const popularTokens = mainnetTokens
          .filter((token) => POPULAR_TOKEN_ADDRESSES.includes(token.address))
          .slice(0, 100);

        setUserTokens(userTokens);
        setPublicTokens(popularTokens);
      } catch (err) {
        setError("Failed to fetch tokens. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey]);

  const filteredUserTokens = userTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublicTokens = publicTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] pt-24 pb-8 px-8">
      <motion.div
        className="absolute top-36 right-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
        animate={{ rotate: [0, 15, -15, 0], y: [-30, 30] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <motion.img
          src={activeSection === "solana" ? "Sol.png" : "Eth.png"}
          className="w-full h-full mt-12 text-purple-500/20"
        />
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Solana Token Explorer
              </h1>
              <p className="text-gray-400 mt-2">
                {publicKey
                  ? "Manage your tokens and explore the network"
                  : "Explore tokens on Solana network"}
              </p>
            </div>

            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-48 bg-white/5 rounded-xl border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {publicKey && (
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                    Your Created Tokens
                  </h2>
                  {filteredUserTokens.length === 0 ? (
                    <div className="text-center py-12">
                      <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
                      <h3 className="text-xl text-gray-300 mb-2">
                        No Tokens Found
                      </h3>
                      <p className="text-gray-500">
                        {searchQuery
                          ? "No matches for your search"
                          : "You haven't created any tokens yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredUserTokens.map((token) => (
                        <TokenCard key={token.address} token={token} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  Popular Tokens
                </h2>
                {filteredPublicTokens.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl text-gray-300 mb-2">
                      No Tokens Found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No matches for your search"
                        : "No popular tokens found"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublicTokens.map((token) => (
                      <TokenCard key={token.address} token={token} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const TokenCard = ({ token }: { token: TokenInfo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        {token.logoURI ? (
          <img
            src={token.logoURI}
            alt={token.name}
            className="w-12 h-12 rounded-full bg-white/5 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <FiPackage className="text-2xl text-purple-400" />
          </div>
        )}
        <div>
          <h3 className="font-semibold">{token.name}</h3>
          <span className="text-sm text-purple-400">{token.symbol}</span>
        </div>
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(token.address)}
        className="text-gray-400 hover:text-purple-400 transition-colors"
      >
        <FiCopy className="text-xl" />
      </button>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">Address:</span>
        <span className="font-mono text-gray-300 truncate max-w-[120px]">
          {token.address}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Decimals:</span>
        <span className="text-gray-300">{token.decimals}</span>
      </div>
      {token.extensions?.website && (
        <div className="flex justify-between">
          <span className="text-gray-400">Website:</span>
          <a
            href={token.extensions.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 truncate max-w-[120px]"
          >
            {token.extensions.website}
          </a>
        </div>
      )}
    </div>
  </motion.div>
);

export default CreatedTokens;
