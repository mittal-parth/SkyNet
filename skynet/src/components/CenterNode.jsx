import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";
import { SiDataverse } from "react-icons/si";

const CenterNode = styled.div`
  width: 80px;
  height: 80px;
  position: relativ e;
  background: none;
  border: 2px solid #8e44ad; /* Purple border */
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 0;
    border: 40px solid transparent;
    border-bottom: none;
    border-top-color: #8e44ad; /* Purple border color */
    border-style: hidden; /* Hide border on certain sides */
  }

  &::before {
    top: -2px;
    border-right: none; /* Hide right border */
  }

  &::after {
    bottom: -2px;
    border-left: none; /* Hide left border */
  }
`;

const IconWrapper = styled.div`
  color: #fff; /* White color for the icon */
  transform: rotate(-45deg);
`;

const CenterNodeComponent = ({ isConnectable }) => {
  const onClick = useCallback(() => {
    console.log("Center Node clicked");
  }, []);

  return (
    <CenterNode onClick={onClick}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <IconWrapper>
        <SiDataverse size={24} />
      </IconWrapper>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </CenterNode>
  );
};

export default CenterNodeComponent;
