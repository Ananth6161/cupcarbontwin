import React from 'react';

const Dashboard = () => {
  const url = 'https://cupcarbontwin.kb.asia-south1.gcp.elastic-cloud.com:9243/app/dashboards#/view/b4c86470-75bb-11ee-afaa-231590a2d0a9?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-100y%2Cto%3Anow))';

  return (
    <div>
      <iframe src="https://cupcarbontwin.kb.asia-south1.gcp.elastic-cloud.com:9243/app/dashboards?auth_provider_hint=anonymous1#/view/4b4d2460-761d-11ee-9610-6f981915d4e7?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-100y%2Cto%3Anow))" height="5400" width="3000"></iframe>
    </div>
  );
};

export default Dashboard;
