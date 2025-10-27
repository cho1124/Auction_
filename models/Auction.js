import mongoose from "mongoose";

/* -------------------------------
   📦 Schema 정의
--------------------------------*/
const auctionSchema = new mongoose.Schema({
  itemId: Number,
  sellerId: String,
  price: Number,             // 시작가
  currentPrice: Number,      // 현재 최고가
  highestBidder: String,     // 최고 입찰자
  isClosed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;