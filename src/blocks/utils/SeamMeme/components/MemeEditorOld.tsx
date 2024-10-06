const MemeEditorOld = () => {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between m-2'>
                <div className='flex flex-row text-gray-400 space-x-2'>
                    <div className='px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center'>
                        <button className='w-full h-full'><UndoIcon color='inherit' /></button>
                    </div>
                    <div className='px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center'>
                        <button className='w-full h-full'><RedoIcon color='inherit' /></button>
                    </div>
                </div>
                <div className='px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center text-gray-400'>
                    <button className='w-full h-full'><DeleteOutlineIcon color='inherit' /></button>
                </div>
            </div>
            <button className='flex-1 border-2 bg-gray-200 rounded-lg text-gray-400 m-2'>
                <div className='p-4'><AddCircleOutlineIcon fontSize='large' color='inherit' /></div>
                <p className='p-4 font-bold'>Tap to Start Creating</p>
            </button>
            <div className='flex justify-between'>
                {memeEditorButtons.map((x, index) => {
                    return (
                        <MemeEditorButton key={index} title={x.title} icon={x.icon} />
                    )
                })}
            </div>
            <div className='w-full p-1 flex items-center justify-center my-2 border-t-2 border-gray-200'>
                <div className='bg-black rounded-full m-2'>Image</div>
                <input className='w-full m-2 text-sm text-gray-400 h-full p-2' placeholder='Say Something...' />
            </div>
            <div className='w-full p-1 flex items-center justify-center my-2'>
                <button className='bg-blue-600 w-full h-full h-16 rounded-lg text-white'> Post </button>
            </div>
        </div>
    )
}

export default MemeEditorOld