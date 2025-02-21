import React from 'react';

export function CertificationsSection() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Certifications</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Certification</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ISO 14001</td>
                <td><div className="badge badge-success">Active</div></td>
                <td>2024-12-01</td>
              </tr>
              <tr>
                <td>Green Fleet</td>
                <td><div className="badge badge-success">Active</div></td>
                <td>2024-11-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
