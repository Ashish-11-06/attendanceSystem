import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { getAllAttendanceReports } from "../Redux/Slices/AttendanceReportSlice";

const AttendanceReport = forwardRef((props, ref) => {
  const printRef = useRef();
  const dispatch = useDispatch();

  const { data: reportsData, loading, error } = useSelector(
    (state) => state.attendanceReport
  );

  useEffect(() => {
    dispatch(getAllAttendanceReports());
  }, [dispatch]);

  useImperativeHandle(ref, () => ({
    print: () => {
      const input = printRef.current;
      if (!input) return;
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("attendance-report-multiple-events.pdf");
      });
    },
  }));

  if (loading) return <div>Loading attendance reports...</div>;

  if (error) {
    // Fix: safely extract error message string
    const errorMsg =
      typeof error === "string"
        ? error
        : error?.message || JSON.stringify(error) || "Unknown error";
    return <div>Error: {errorMsg}</div>;
  }

  if (!reportsData || reportsData.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "210mm",
        backgroundColor: "white",
      }}
      ref={printRef}
    >
      {reportsData.map(({ event_id, unit_summary }) => {
        if (!unit_summary || !unit_summary.length) return null;
        return (
          <div key={event_id} style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>
              Attendance Report for Event {event_id}
            </h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Unit",
                    "Reg. Gents",
                    "Reg. Ladies",
                    "Reg. Total",
                    "Unreg. Gents",
                    "Unreg. Ladies",
                    "Unreg. Total",
                    "Satsang Strength",
                    "Grand Total",
                  ].map((head, idx) => (
                    <th key={idx} style={styles.th}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unit_summary.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{item.unit_name || item.unit_id}</td>
                    <td style={styles.td}>{item.total_register_male ?? 0}</td>
                    <td style={styles.td}>{item.total_register_female ?? 0}</td>
                    <td style={styles.td}>{item.total_register ?? 0}</td>
                    <td style={styles.td}>{item.total_unregister_male ?? 0}</td>
                    <td style={styles.td}>{item.total_unregister_female ?? 0}</td>
                    <td style={styles.td}>{item.total_unregister ?? 0}</td>
                    <td style={styles.td}>{item.total_present ?? 0}</td>
                    <td style={styles.td}>{item.grand_total ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
});

const styles = {
  th: {
    border: "1px solid black",
    padding: "6px",
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  td: {
    border: "1px solid black",
    padding: "6px",
  },
};

export default AttendanceReport;
