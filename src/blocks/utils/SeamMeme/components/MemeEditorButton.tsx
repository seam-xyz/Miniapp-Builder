const memeEditorButtons = [
    { title: "Canvas", icon: Grid3x3Icon },
    { title: "Text", icon: AbcIcon },
    { title: "Media", icon: AddPhotoAlternateIcon },
    { title: "Crop", icon: CropIcon },
]

interface MemeEditorButtonProps {
    title: string;
    icon: React.ElementType;
}

const MemeEditorButton: React.FC<MemeEditorButtonProps> = ({ title, icon: Icon }) => {
    return (
        <button className='m-2 p-2 w-full flex-grow border-2 rounded-xl flex flex-col items-center justify-center bg-sky-500 text-white font-bold'>
            <div className='w-full flex justify-center p-1 flex-grow'>
                <Icon />
            </div>
            <div className='w-full text-center p-1 flex-grow text-sm'>{title}</div>
        </button>
    )
}

export default MemeEditorButton