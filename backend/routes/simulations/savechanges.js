const express = require('express');
const app = express();
const esClient = require('./elastic');
app.post('/save-changes', async (req, res) => {
    try {
      const { changeId, added, deleted, modified } = req.body;
      const response = await esClient.index({
        index: 'your_changes_index', 
        body: {
          changeId,
          addedNodes: added,
          deletedNodeIds: deleted,
          modifiedNodes: modified,
        },
      });
  
      res.json({ message: 'Changes saved successfully', documentId: response.body._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });