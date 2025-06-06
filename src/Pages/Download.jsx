import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Download = forwardRef((props, ref) => {
  const printRef = useRef();

  useImperativeHandle(ref, () => ({
    print: () => {
      const input = printRef.current;
      if (!input) {
        console.error("printRef.current is null");
        return;
      }
      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("attendance-report.pdf");
        })
        .catch((err) => {
          console.error("html2canvas error:", err);
        });
    },
  }));

  return (
    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
      <div
        ref={printRef}
        id="print-content"
        style={{
          padding: "24px",
          backgroundColor: "white",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "12px",
          color: "#222",
          width: "900px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          Attendance Report
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            boxShadow:
              "0 0 5px rgba(0, 0, 0, 0.15)", // subtle shadow for better table visibility
          }}
        >
          <thead>
            <tr>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Reg. Gents</th>
              <th style={styles.th}>Reg. Ladies</th>
              <th style={styles.th}>Reg. Total</th>
              <th style={styles.th}>Unreg. Gents</th>
              <th style={styles.th}>Unreg. Ladies</th>
              <th style={styles.th}>Unreg. Total</th>
              <th style={styles.th}>Satsang Strength</th>
              <th style={styles.th}>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              "358-Jai Jawan Nagar",
              "849-Navi Peth (Pune City)",
              "940-Hadapsar (Pune)",
              "964-Najre",
              "979-Nangaon",
              "1037-Indira Nagar",
              "1038-Perne Phata",
              "1142-Daund",
              "1482-Loni Kalbhor",
              "1536-Manjari",
              "1593-Warje",
              "1661-Kothrud",
              "1695-Jejuri",
              "1809-Dhanauri",
              "1828-Awhalwadi",
              "1862-Janta Wasahat",
              "1866-Annapur",
              "2050-Rajewadi",
              "2069-Shikrapur",
            ].map((unit, index) => (
              <tr key={index}>
                <td style={styles.td}>{unit}</td>
                {[...Array(8)].map((_, i) => (
                  <td style={styles.td} key={i}>
                    0
                  </td>
                ))}
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
    padding: "10px 12px",
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontSize: "13px",
  },
  td: {
    border: "1px solid black",
    padding: "8px 12px",
    fontSize: "12px",
  },
};

export default Download;
