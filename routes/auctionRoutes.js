import express from "express";
import mongoose from "mongoose";

const router = express.Router();

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


/* -------------------------------
   🧱 API
--------------------------------*/

// ✅ 경매 생성
router.post("/create", async (req, res) => {
  try {
    const { itemId, sellerId, price } = req.body;

    // 필수값 확인
    if (!itemId || !sellerId || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (itemId, sellerId, price)"
      });
    }

    // currentPrice 초기화
    const auction = await Auction.create({
      itemId,
      sellerId,
      price,
      currentPrice: price,
      highestBidder: null,
    });

    res.json({ success: true, auction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ 경매 목록 조회
router.get("/list", async (req, res) => {
  try {
    const auctions = await Auction.find({ isClosed: false });
    res.json({ success: true, auctions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ 경매 입찰
router.post("/bid/:id", async (req, res) => {
  const { id } = req.params;
  const { bidder, bidAmount } = req.body;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    if (auction.isClosed) {
      return res.status(400).json({ success: false, message: "Auction is closed" });
    }

    if (bidAmount <= auction.currentPrice) {
      return res.status(400).json({ success: false, message: "Bid amount must be higher than current price" });
    }

    // 최고가 갱신
    auction.currentPrice = bidAmount;
    auction.highestBidder = bidder;

    await auction.save();
    res.json({ success: true, message: "Bid placed successfully", auction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ 경매 종료
router.post("/close/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction.isClosed = true;
    await auction.save();

    res.json({ success: true, message: "Auction closed successfully", auction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
