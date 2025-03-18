import React, { useEffect, useState, useCallback } from 'react';
import Tree from 'react-d3-tree';
import { message } from 'antd';
import axios from 'axios';

const containerStyles = {
  width: '100%',
  height: '500px',
  backgroundColor: '#f0f8ff',
  border: '1px solid #add8e6',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '24px',
};

const FamilyTreeDiagram = () => {
  const [treeData, setTreeData] = useState(null);

  const buildTree = useCallback((members) => {
    const map = {};
    members.forEach((member) => {
      map[member._id] = { ...member, children: [] };
    });
    let root = null;
    members.forEach((member) => {
      if (!member.parentId) {
        root = map[member._id];
      } else if (map[member.parentId]) {
        map[member.parentId].children.push(map[member._id]);
      }
    });
    return root ? [root] : [];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/family/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const members = response.data.members;
        setTreeData(buildTree(members));
      } catch (error) {
        console.error('Error fetching tree data:', error);
        message.error('Lỗi khi tải dữ liệu cây gia phả');
      }
    };
    fetchData();
  }, [buildTree]);

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle
        r="25"
        fill="#87ceeb"
        stroke="#4682b4"
        strokeWidth="2"
        onClick={toggleNode}
        style={{ cursor: 'pointer' }}
      />
      <text
        fill="#333"
        x="30"
        dy="-2"
        fontSize="16"
      >
        {nodeDatum.name}
      </text>
      {nodeDatum.role && (
        <text
          fill="#555"
          x="30"
          dy="18"
          fontSize="14"
        >
          {nodeDatum.role}
        </text>
      )}
    </g>
  );

  return (
    <div style={containerStyles}>
      {treeData && treeData.length > 0 ? (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 300, y: 50 }}
          separation={{ siblings: 1.8, nonSiblings: 2.5 }}
          renderCustomNodeElement={renderCustomNode}
          pathFunc="elbow"
          zoomable
          styles={{
            links: { stroke: '#a9a9a9', strokeWidth: '2px' },
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '200px' }}>Chưa có dữ liệu gia phả</div>
      )}
    </div>
  );
};

export default FamilyTreeDiagram;