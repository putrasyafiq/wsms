# WSMS project instructions

Product version baseline is v1 (VERSION contains 1.00). For each delivered change, increment the current product version using decimal arithmetic: minor +0.01, medium +0.10, major +1.00. Update VERSION and CHANGELOG.md together and tag release commits. These release numbers are separate from the browser storage/data schema; do not change the schema number just to bump a product version.

The GitHub source checkout is /workspace/wsms (origin https://github.com/putrasyafiq/wsms.git). The Sites development checkout is /workspace/sites/warehouse-studio. Keep the application source in dist/ aligned when preparing releases. Do not copy credentials, local work files or Sites repository authentication into GitHub.
