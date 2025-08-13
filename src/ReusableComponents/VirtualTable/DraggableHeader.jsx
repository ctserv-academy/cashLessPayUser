import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default function DraggableHeader({ children, draggableId, index }) {
    return (
        <Draggable key={draggableId} draggableId={draggableId} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {children}
                </div>
            )}
        </Draggable>
    )
}
