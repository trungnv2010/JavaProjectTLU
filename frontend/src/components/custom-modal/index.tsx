import {Box, Modal, ModalProps, styled,} from "@mui/material";
import React from "react";


interface TCustomModal extends ModalProps {
    children: React.ReactNode,
    onClose: () => void,
    open: boolean
}

const StyleModal = styled(Modal)<ModalProps>(({theme}) => ({
    zIndex: 1300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}))

const CustomModal = (props: TCustomModal) => {
    const {children, open, onClose} = props
    return (
        <StyleModal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                height: "100%", width: "100vw", overflow: "auto"
            }}>
                <Box sx={{maxHeight: "100vh", overflow: "auto"}}>
                    <Box sx={{
                        height: "100%", width: "100%", minHeight: "100vh", display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Box sx={{
                            margin: "40px 0px"
                        }}>
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </StyleModal>
    )
}

export default CustomModal