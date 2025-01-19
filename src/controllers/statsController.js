const { getDatabase } = require("../config/dbConnection");
const paymentCollection = getDatabase().collection("payment");
const workSheetCollection = getDatabase().collection("workSheet");
const usersCollection = getDatabase().collection("users");

const adminStats = async (req, res) => {
    try {
        // 1. User Count and Role Distribution
        const userStats = await usersCollection.aggregate([
            {
                $group: {
                    _id: "$roleValue",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // 2. Average Work Hours per Month
        const avgWorkHoursPerMonth = await workSheetCollection.aggregate([
            {
                $addFields: {
                    // Ensure the date is properly parsed
                    parsedDate: { 
                        $toDate: "$date" 
                    }
                }
            },
            {
                $group: {
                    _id: { 
                        month: { $month: "$parsedDate" },
                        year: { $year: "$parsedDate" }
                    },
                    totalHours: { $sum: "$hours" },
                    employeeCount: { $addToSet: "$email" }
                }
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    avgHoursPerEmployee: { 
                        $divide: [
                            "$totalHours", 
                            { $max: [{ $size: "$employeeCount" }, 1] } 
                        ] 
                    }
                }
            },
            { $sort: { year: -1, month: -1 } },
            { $limit: 6 }
        ]).toArray();

        // 3. Total Salary Paid and Pending
        const salaryStats = await paymentCollection.aggregate([
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // 4. Most and Least Working Employees
        const employeeWorkStats = await workSheetCollection.aggregate([
            {
                $group: {
                    _id: "$email",
                    totalHours: { $sum: "$hours" },
                    designation: { $first: "$designation" }
                }
            },
            { $sort: { totalHours: -1 } },
            {
                $project: {
                    email: "$_id",
                    totalHours: 1,
                    designation: 1
                }
            },
            { $limit: 5 }
        ]).toArray();

        // 5. Monthly Payment Trends
        const monthlyPaymentTrends = await paymentCollection.aggregate([
            {
                $match: { status: "completed" }
            },
            {
                $addFields: {
                    // Use month and year directly from the document
                    monthYear: {
                        $concat: [
                            { $toString: "$year" },
                            "-",
                            { $toString: "$month" }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { 
                        month: "$month", 
                        year: "$year",
                        monthYear: "$monthYear"
                    },
                    totalPaid: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 }
        ]).toArray();

        // Prepare Response
        const stats = {
            userRoleDistribution: userStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            
            avgWorkHoursPerMonth,
            
            salaryStats: salaryStats.reduce((acc, stat) => {
                acc[stat._id] = {
                    totalAmount: stat.totalAmount,
                    count: stat.count
                };
                return acc;
            }, {}),
            
            topWorkingEmployees: employeeWorkStats.map(emp => ({
                email: emp._id,
                totalHours: emp.totalHours,
                designation: emp.designation
            })),
            
            monthlyPaymentTrends: monthlyPaymentTrends.map(trend => ({
                month: trend._id.month,
                year: trend._id.year,
                totalPaid: trend.totalPaid
            }))
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ 
            message: "Error fetching admin stats", 
            error: error.message 
        });
    }
};

const hrStats = async (req, res) => {
    try {
        

        // 1. Average Work Hours per Employee per Month
        const avgWorkHoursPerEmployee = await workSheetCollection.aggregate([
            {
                $addFields: {
                    parsedDate: { $toDate: "$date" }
                }
            },
            {
                $group: {
                    _id: {
                        email: "$email",
                        month: { $month: "$parsedDate" },
                        year: { $year: "$parsedDate" }
                    },
                    totalHours: { $sum: "$hours" },
                    taskCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.email",
                    foreignField: "email",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: "$employeeDetails"
            },
            {
                $project: {
                    email: "$_id.email",
                    month: "$_id.month",
                    year: "$_id.year",
                    totalHours: 1,
                    taskCount: 1,
                    name: "$employeeDetails.name",
                    designation: "$employeeDetails.designation"
                }
            },
            {
                $sort: { 
                    year: -1, 
                    month: -1, 
                    totalHours: -1 
                }
            }
        ]).toArray();

        // 2. Top and Bottom Performing Employees
        const employeePerformanceRanking = await workSheetCollection.aggregate([
            {
                $group: {
                    _id: "$email",
                    totalHours: { $sum: "$hours" },
                    taskCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "email",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: "$employeeDetails"
            },
            {
                $project: {
                    email: "$_id",
                    name: "$employeeDetails.name",
                    designation: "$employeeDetails.designation",
                    totalHours: 1,
                    taskCount: 1
                }
            },
            {
                $sort: { totalHours: -1 }
            }
        ]).toArray();

        // 3. Task Distribution by Type
        const taskTypeDistribution = await workSheetCollection.aggregate([
            {
                $group: {
                    _id: "$task",
                    totalHours: { $sum: "$hours" },
                    taskCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalHours: -1 }
            }
        ]).toArray();

        // 4. Monthly Work Trend
        const monthlyWorkTrend = await workSheetCollection.aggregate([
            {
                $addFields: {
                    parsedDate: { $toDate: "$date" }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$parsedDate" },
                        year: { $year: "$parsedDate" }
                    },
                    totalHours: { $sum: "$hours" },
                    taskCount: { $sum: 1 }
                }
            },
            {
                $sort: { 
                    "_id.year": -1, 
                    "_id.month": -1 
                }
            },
            {
                $limit: 6 // Last 6 months
            }
        ]).toArray();

        // 5. Employee Task Breakdown
        const employeeTaskBreakdown = await workSheetCollection.aggregate([
            {
                $group: {
                    _id: {
                        email: "$email",
                        task: "$task"
                    },
                    totalHours: { $sum: "$hours" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.email",
                    foreignField: "email",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: "$employeeDetails"
            },
            {
                $project: {
                    email: "$_id.email",
                    task: "$_id.task",
                    name: "$employeeDetails.name",
                    totalHours: 1
                }
            },
            {
                $sort: { totalHours: -1 }
            }
        ]).toArray();

        // Prepare Response
        const hrStats = {
            avgWorkHoursPerEmployee,
            employeePerformanceRanking: {
                topPerformers: employeePerformanceRanking.slice(0, 5),
                bottomPerformers: employeePerformanceRanking.slice(-5).reverse()
            },
            taskTypeDistribution,
            monthlyWorkTrend,
            employeeTaskBreakdown
        };

        res.status(200).json(hrStats);
    } catch (error) {
        console.error("Error fetching HR stats:", error);
        res.status(500).json({ 
            message: "Error fetching HR stats", 
            error: error.message 
        });
    }
};


module.exports = { adminStats, hrStats };