import { Item, Claim, User } from '../types';

/**
 * Exports item list to CSV for Excel
 */
export function exportItemsToCSV(items: Item[], filename = 'campuslost-items-report.csv') {
  const headers = [
    'Item ID',
    'Report Type',
    'Item Name',
    'Category',
    'Brand',
    'Color',
    'Location',
    'Date',
    'Time',
    'Status',
    'Reported By',
    'Department',
    'Contact Number',
    'Created At'
  ];

  const rows = items.map(item => [
    `"${item.id}"`,
    `"${item.type}"`,
    `"${item.itemName.replace(/"/g, '""')}"`,
    `"${item.category}"`,
    `"${item.brand || 'N/A'}"`,
    `"${item.color}"`,
    `"${item.location.replace(/"/g, '""')}"`,
    `"${item.date}"`,
    `"${item.time}"`,
    `"${item.status}"`,
    `"${item.userName.replace(/"/g, '""')}"`,
    `"${item.userDept.replace(/"/g, '""')}"`,
    `"${item.contactNumber || 'N/A'}"`,
    `"${item.createdAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports claims list to CSV
 */
export function exportClaimsToCSV(claims: Claim[], filename = 'campuslost-claims-report.csv') {
  const headers = [
    'Claim ID',
    'Item ID',
    'Item Name',
    'Item Location',
    'Student Name',
    'Roll Number',
    'Student Email',
    'Phone',
    'Department',
    'Status',
    'Staff Remarks',
    'Verified By',
    'Created Date',
    'Resolution Date'
  ];

  const rows = claims.map(c => [
    `"${c.id}"`,
    `"${c.foundItemId}"`,
    `"${c.itemName.replace(/"/g, '""')}"`,
    `"${(c.itemLocation || '').replace(/"/g, '""')}"`,
    `"${c.studentName.replace(/"/g, '""')}"`,
    `"${c.studentRollNo}"`,
    `"${c.studentEmail || ''}"`,
    `"${c.studentPhone}"`,
    `"${c.studentDepartment || ''}"`,
    `"${c.status}"`,
    `"${(c.staffRemarks || '').replace(/"/g, '""')}"`,
    `"${c.verifiedByStaffName || 'Pending'}"`,
    `"${c.createdAt}"`,
    `"${c.resolvedAt || 'N/A'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prints or generates a printable PDF receipt for an approved claim pickup
 */
export function printClaimPickupPass(claim: Claim, item?: Item) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CampusLost - Official Claim Pass #${claim.id}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
        .pass-card { max-width: 650px; margin: 0 auto; border: 2px solid #2563eb; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #1e40af; }
        .badge { background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
        .val { font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 2px; }
        .qr-section { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-top: 20px; }
        .instructions { font-size: 12px; color: #475569; line-height: 1.5; }
        .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        @media print {
          body { padding: 0; }
          .pass-card { border: 2px solid #000; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="pass-card">
        <div class="header">
          <div>
            <div class="logo">CAMPUSLOST 🛡️</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Official Item Recovery & Pickup Authorization</div>
          </div>
          <div class="badge">VERIFIED & APPROVED</div>
        </div>

        <div class="grid">
          <div>
            <div class="label">Claim Reference</div>
            <div class="val">${claim.id}</div>
          </div>
          <div>
            <div class="label">Date of Approval</div>
            <div class="val">${claim.resolvedAt ? new Date(claim.resolvedAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>
          <div>
            <div class="label">Student Name</div>
            <div class="val">${claim.studentName}</div>
          </div>
          <div>
            <div class="label">Student Roll No / ID</div>
            <div class="val">${claim.studentRollNo} (${claim.studentDepartment || 'General'})</div>
          </div>
          <div>
            <div class="label">Recovered Item</div>
            <div class="val">${claim.itemName}</div>
          </div>
          <div>
            <div class="label">Collection Location</div>
            <div class="val">${item?.handoverLocation || claim.itemLocation || 'Campus Security Main Desk'}</div>
          </div>
          <div>
            <div class="label">Verifying Officer</div>
            <div class="val">${claim.verifiedByStaffName || 'Campus Security Duty Officer'}</div>
          </div>
          <div>
            <div class="label">Student Contact</div>
            <div class="val">${claim.studentPhone}</div>
          </div>
        </div>

        <div class="qr-section">
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #1e3a8a;">Verification Code</div>
            <div style="font-family: monospace; font-size: 13px; color: #334155; margin-top: 4px;">${claim.qrPassCode || 'CL-QR-' + claim.id}</div>
            <div class="instructions" style="margin-top: 8px;">
              Present this digital/printed pass alongside your original Student ID card at the designated security desk to collect your item.
            </div>
          </div>
          <div style="padding: 10px; background: white; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center;">
            <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="white"/>
              <rect x="10" y="10" width="24" height="24" stroke="black" stroke-width="6" fill="black"/>
              <rect x="66" y="10" width="24" height="24" stroke="black" stroke-width="6" fill="black"/>
              <rect x="10" y="66" width="24" height="24" stroke="black" stroke-width="6" fill="black"/>
              <rect x="18" y="18" width="8" height="8" fill="white"/>
              <rect x="74" y="18" width="8" height="8" fill="white"/>
              <rect x="18" y="74" width="8" height="8" fill="white"/>
              <rect x="42" y="14" width="16" height="8" fill="black"/>
              <rect x="42" y="30" width="16" height="8" fill="black"/>
              <rect x="42" y="46" width="16" height="16" fill="black"/>
              <rect x="14" y="42" width="12" height="12" fill="black"/>
              <rect x="66" y="42" width="20" height="8" fill="black"/>
              <rect x="66" y="58" width="10" height="16" fill="black"/>
              <rect x="80" y="74" width="10" height="16" fill="black"/>
              <rect x="42" y="70" width="16" height="20" fill="black"/>
            </svg>
          </div>
        </div>

        <div class="footer">
          CampusLost Centralized University Lost & Found System • Generated on ${new Date().toLocaleString()}
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
