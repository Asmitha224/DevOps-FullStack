const Paper = require('../models/Paper');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const totalPapers = await Paper.countDocuments();
    const totalUsers = await User.countDocuments();

    // Recent uploads (last 5)
    const recentPapers = await Paper.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name email');

    // Storage used (sum of all PDF file sizes)
    const storageResult = await Paper.aggregate([
      { $group: { _id: null, totalSize: { $sum: '$pdfFile.size' } } },
    ]);
    const storageUsed = storageResult.length > 0 ? storageResult[0].totalSize : 0;
    const storageUsedMB = (storageUsed / (1024 * 1024)).toFixed(2);

    // Papers per month (last 12 months)
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const papersPerMonth = await Paper.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Build complete month labels array
    const monthLabels = [];
    const monthData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthLabels.push(label);
      const found = papersPerMonth.find(
        (p) => p._id.year === d.getFullYear() && p._id.month === d.getMonth() + 1
      );
      monthData.push(found ? found.count : 0);
    }

    // Papers by category
    const papersByCategory = await Paper.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const categoryLabels = papersByCategory.map((c) => c._id);
    const categoryData = papersByCategory.map((c) => c.count);

    res.render('dashboard/index', {
      title: 'Dashboard',
      totalPapers,
      totalUsers,
      recentPapers,
      storageUsedMB,
      recentUploads: recentPapers.length,
      monthLabels: JSON.stringify(monthLabels),
      monthData: JSON.stringify(monthData),
      categoryLabels: JSON.stringify(categoryLabels),
      categoryData: JSON.stringify(categoryData),
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard data.');
    res.render('dashboard/index', {
      title: 'Dashboard',
      totalPapers: 0,
      totalUsers: 0,
      recentPapers: [],
      storageUsedMB: 0,
      recentUploads: 0,
      monthLabels: '[]',
      monthData: '[]',
      categoryLabels: '[]',
      categoryData: '[]',
    });
  }
};
