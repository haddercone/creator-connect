import React, { useState } from 'react'

const useToggleQuestionOpenState = () => {
    const [OpenStates, setOpenStates] = useState<boolean[]>([]);

    const toggleOpenState = (index: number) => {
        const newOpenStates = [...OpenStates];
        newOpenStates[index] = !newOpenStates[index];
        setOpenStates(newOpenStates);
    }

    return {toggleOpenState, setOpenStates, OpenStates};
  
}

export default useToggleQuestionOpenState;