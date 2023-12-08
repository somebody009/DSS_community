import React from 'react'
import { createBoard } from '@wixc3/react-board';

export default createBoard({
    name: 'New Board',
    Board: () => null,
    isSnippet: true,
    environmentProps: {
        canvasWidth: 860,
        windowBackgroundColor: '#f0e7e7'
    }
});
