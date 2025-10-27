import cron from 'node-cron';
import Auction from './models/Auction.js';
// 경매 종료 스케줄러 - 매 분마다 실행
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const auctionsToClose = await Auction.find({ isClosed: false, createdAt: { $lte: new Date(now - 1 * 60 * 1000) } });
    // 경매 종료 처리
    for (const auction of auctionsToClose) {
      auction.isClosed = true;
      await auction.save();
      console.log(`Auction ${auction._id} closed.`);
    }
  } catch (error) {
    console.error('Error closing auctions:', error);
  }
});
