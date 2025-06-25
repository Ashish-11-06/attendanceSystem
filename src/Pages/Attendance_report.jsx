import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const AttendanceReport = forwardRef(({ report }, ref) => {
  const printRef = useRef();

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
        pdf.save(`attendance-report-event-${report.event_id}.pdf`);
      });
    },
  }));

  if (!report || !report.unit_summary || report.unit_summary.length === 0) return null;
  console.log("event_name", report?.event_name);

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
      {/* Wrapper with padding */}
      <div style={{ padding: "24px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Attendance Report for Event {report.event_name || report.event_id}
        
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
            {report.unit_summary.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.unit_name || "N/A"}</td>
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
