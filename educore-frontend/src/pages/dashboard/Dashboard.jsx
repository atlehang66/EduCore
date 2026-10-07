import { useEffect, useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import api from "../../services/api";

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [outstandingFees, setOutstandingFees] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadDashboard() {
    try {
      const studentResponse = await api.get("/students");

      setStudentCount(studentResponse.data.students.length);

      const teacherResponse = await api.get("/teachers");

      setTeacherCount(teacherResponse.data.teachers.length);

      const classResponse = await api.get("/classes");

      setClassCount(classResponse.data.classes.length);

      const [invoiceResponse, paymentResponse] = await Promise.all([
        api.get("/invoices"),
        api.get("/payments"),
      ]);

      const paymentsByInvoice = paymentResponse.data.payments.reduce(
        (totals, payment) => {
          const invoiceId = payment.invoice_id;
          const paymentTotal = totals[invoiceId] || 0;

          totals[invoiceId] = paymentTotal + Number(payment.amount);
          return totals;
        },
        {}
      );

      const totalOutstanding = invoiceResponse.data.invoices.reduce(
        (total, invoice) => {
          const invoiceAmount = Number(invoice.amount);
          const paidAmount = paymentsByInvoice[invoice.invoice_id] || 0;
          const invoiceBalance = Math.max(0, invoiceAmount - paidAmount);

          return total + invoiceBalance;
        },
        0
      );

      setOutstandingFees(totalOutstanding);

      const attendanceResponse = await api.get("/attendance");
      const attendanceRecords = attendanceResponse.data.attendance;
      const presentRecords = attendanceRecords.filter(
        (record) => record.status === "present"
      );
      const absentRecords = attendanceRecords.filter(
        (record) => record.status === "absent"
      );
      const presentTotal = presentRecords.length;
      const absentTotal = absentRecords.length;
      const attendanceTotal = presentTotal + absentTotal;

      setPresentCount(presentTotal);
      setAbsentCount(absentTotal);
      setAttendancePercentage(
        attendanceTotal === 0
          ? 0
          : Math.round((presentTotal / attendanceTotal) * 100)
      );

      const notificationResponse = await api.get("/notifications");

      setNotifications(notificationResponse.data.notifications);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Overview</h2>
          <p>Here's what's happening across your school.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Students"
          value={loading ? "..." : studentCount}
          description="Currently enrolled"
        />

        <StatCard
          title="Teachers"
          value={loading ? "..." : teacherCount}
          description="Active teachers"
        />

        <StatCard
          title="Classes"
          value={loading ? "..." : classCount}
          description="Active classes"
        />

        <StatCard
          title="Outstanding Fees"
          value={loading ? "..." : `R${outstandingFees.toLocaleString()}`}
          description="Awaiting payment"
        />

        <StatCard
          title="Attendance"
          value={loading ? "..." : `${attendancePercentage}%`}
          description="Present attendance"
        />

        <StatCard
          title="Present"
          value={loading ? "..." : presentCount}
          description="Recorded present"
        />

        <StatCard
          title="Absent"
          value={loading ? "..." : absentCount}
          description="Recorded absent"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest notifications</p>
            </div>
          </div>

          <div className="activity-list">
            {loading ? (
              <div className="activity-item">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="activity-item">No recent activity.</div>
            ) : (
              notifications.map((notification) => (
                <div
                  className="activity-item"
                  key={notification.notification_id}
                >
                  <div>
                    <strong>{notification.title}</strong>
                    <span>{notification.message}</span>
                  </div>
                  <small>{notification.created_at}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;