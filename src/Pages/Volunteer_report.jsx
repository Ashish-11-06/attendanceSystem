import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolunteerReportData } from "../Redux/Slices/volunteerReportSlice";

const Volunteer_report = forwardRef((props, ref) => {
  const printRef = useRef();
  const dispatch = useDispatch();

  const { data: reportData, loading, error } = useSelector(
    (state) => state.volunteerReport
  );

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
          // Add current date to filename
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;
          pdf.save(`volunteer-report-${dateStr}.pdf`);
        })
        .catch((err) => {
          console.error("html2canvas error:", err);
        });
    },
  }));

  useEffect(() => {
    dispatch(fetchVolunteerReportData());
  }, [dispatch]);

  return (
    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
      <div
        ref={printRef}
        id="print-content"
        style={{
          padding: "20px", // ✅ Padding added to all sides
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Volunteer Report</h2>
        <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px" }}>
           Date: {new Date().toLocaleDateString('en-GB')}
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={styles.th}>Khetra</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Reg. Gents</th>
                <th style={styles.th}>Reg. Ladies</th>
                <th style={styles.th}>Reg. Total</th>
                <th style={styles.th}>Unreg. Gents</th>
                <th style={styles.th}>Unreg. Ladies</th>
                <th style={styles.th}>Unreg. Total</th>
                <th style={styles.th}>Active. Total</th>
                {/* <th style={styles.th}>Satsang Strength</th> */}
                <th style={styles.th}>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{item.khetra || "N/A"}</td>
                    <td style={styles.td}>{item.unit_name || "N/A"}</td>
                    <td style={styles.td}>{item.total_male ?? 0}</td>
                    <td style={styles.td}>{item.total_female ?? 0}</td>
                    {/* <td style={styles.td}>{item.total_registered ?? 0}</td> */}
                    <td style={styles.td}>
                      {(item.total_male ?? 0) + (item.total_female ?? 0)}
                    </td>
                    <td style={styles.td}>{item.unregistered_male ?? 0}</td>
                    <td style={styles.td}>{item.unregistered_female ?? 0}</td>
                    <td style={styles.td}>{item.total_unregistered ?? 0}</td>
                    <td style={styles.td}>{item.total_active ?? 0}</td>
                    {/* <td style={styles.td}>
                      {(item.total_registered ?? 0) + (item.total_unregistered ?? 0)}
                    </td> */}

                    <td style={styles.td}>{item.grand_total ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan={9}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

const styles = {
  th: {
    border: "1px solid black",
    padding: "8px",
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
  },
  td: {
    border: "1px solid black",
    padding: "8px",
  },
};

export default Volunteer_report;
