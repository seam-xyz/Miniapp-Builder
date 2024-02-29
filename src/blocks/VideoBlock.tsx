import Block from './Block'
import { BlockModel } from './types'
import Iframely from './utils/Iframely';
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TitleComponent from './utils/TitleComponent';
import FileUploadComponent from './utils/FileUploadComponent';

export default class VideoBlock extends Block {
    props: any;
    render() {
        if (Object.keys(this.model.data).length === 0) {
            return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
        }

        let url = this.model.data["url"]
        let title = this.model.data["title"]
        if (url === undefined) {
            return this.renderErrorState()
        }

        return (
            <div style={{ backgroundColor: this.theme.palette.secondary.main, width: "100%", height: "100%" }}>
                {title && TitleComponent(this.theme, title)}
                {/* <ReactPlayer url={url} /> */}
            </div>
        );
    }

    renderEditModal(done: (data: BlockModel) => void) {
        const onFinish = (event: any) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            let url = data.get('url') as string
            let title = data.get('header') as string
            this.model.data['url'] = url
            this.model.data['title'] = title
            done(this.model)
        };

        const uploaderComponent = <FileUploadComponent fileTypes={"video/*"} onUpdate={fileURL => {
            console.log('File URL:', fileURL)
            this.model.data['url'] = fileURL;
            done(this.model);
        }} />;

        return (
            <>{uploaderComponent}
                <Box
                    component="form"
                    onSubmit={onFinish}
                    style={{}}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="url"
                        label={"Video URL (YouTube, TikTok, Instagram, etc.)"}
                        name="url"
                        defaultValue={this.model.data['url']}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="header"
                        label="Post Title"
                        name="header"
                        defaultValue={this.model.data['title']}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="save-modal-button"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        PREVIEW
                    </Button>
                </Box>
            </>
        )
    }

    renderErrorState() {
        return (
            <h1>Error: Couldn't figure out the url</h1>
        )
    }
}