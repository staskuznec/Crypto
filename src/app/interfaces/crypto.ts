export interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  supply: number;
  logo: string;
}


export interface CryptoHistory{
  count: number;
  currency: string;
  logo: string;
}
