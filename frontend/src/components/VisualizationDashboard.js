// import React from 'react';

// const Dashboard = () => {
//   return (
//     <div>
//       <iframe src="https://digitaltwin.kb.asia-south1.gcp.elastic-cloud.com:9243/app/dashboards?auth_provider_hint=anonymous1#/view/70884f40-8250-11ee-82ca-e764c0a080d7?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-1y%2Cto%3Anow))" height="600" width="800"></iframe>
//     </div>
//   );
// };

// export default Dashboard;
import React from 'react';

const Dashboard = () => {
  const redirectToNewPage = () => {
    // Specify the URL of the new page
    const newPageUrl = "https://digitaltwin.kb.asia-south1.gcp.elastic-cloud.com:9243/app/dashboards?auth_provider_hint=anonymous1#/view/70884f40-8250-11ee-82ca-e764c0a080d7?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-1y%2Cto%3Anow))";
    
    // Use window.location to navigate to the new page
    window.location.href = newPageUrl;
  };

  return (
    <div>
      <button onClick={redirectToNewPage}>Go to Visualisations Page</button>
    </div>
  );
};

export default Dashboard;
