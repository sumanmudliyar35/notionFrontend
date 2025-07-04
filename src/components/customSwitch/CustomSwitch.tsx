import React from 'react';

import * as styled from './style';

const CustomSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) => (
  <styled.FilterToggleContainer onClick={() => onChange(!enabled)}>
    <styled.FilterToggleTrack enabled={enabled}>
      <styled.FilterToggleThumb enabled={enabled} />
    </styled.FilterToggleTrack>
    <span style={{ marginLeft: 8, color: enabled ? '#fff' : '#888' }}>
      {enabled ? 'Filters On' : 'Filters Off'}
    </span>
  </styled.FilterToggleContainer>
);
export default CustomSwitch