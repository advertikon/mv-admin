import {
    Button,
    ButtonGroup,
    Popper,
    TextField,
    ClickAwayListener,
    Paper,
    MenuList,
    MenuItem,
    Grow,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, styled } from '@mui/system';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Mutations, Queries } from '../../../query/query-client';
import SearchCompanyInput from './search-company-select';
import { SendMessageButton, SendMessageType } from './send-message-button';

const messageTypes = ['error', 'info', 'warning'];

const MessageInputField = styled(TextField)(({ theme }) => ({
    '& > div': {
        borderWith: 1,
        borderColor: theme.palette.blue.main,
    },
    marginBottom: '10px',
}));

const MessageTypeSelect = styled(Select)(({ theme }) => ({
    borderColor: theme.palette.blue.main,
    borderWidth: 1,
    borderStyle: 'solid',
    minWidth: 120,
}));

const ComponentBackground = styled(Paper)(({ theme }) => ({
    borderColor: theme.palette.blue.main,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
}));

export function SendMessage() {
    const [messageType, setMessageType] = useState('');
    const [shops, setShops] = useState<string[]>([]);
    const [text, setText] = useState('');

    const {
        mutate: sendMessage,
        isError,
        isIdle,
        failureReason,
        data: sendMessageResponse,
    } = useMutation<unknown, unknown, { text: string; shops: string; type: string }>({
        mutationKey: [Mutations.FEED_APP_SEND_MESSAGE],
    });

    const handleMessageTypeChange = (type: string) => {
        setMessageType(type);
    };

    const sendMessageHandler = (sendType: SendMessageType) => {
        sendMessage({
            text,
            shops: sendType === SendMessageType.ALL ? 'all' : shops.join(','),
            type: messageType,
        });
    };

    const changeMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    return (
        <Box>
            <ComponentBackground elevation={24}>
                <MessageInputField
                    required
                    id="send-message-text"
                    label="Compose message"
                    fullWidth
                    error={isError}
                    helperText={isError ? (failureReason as Error).message : ''}
                    value={text}
                    onChange={changeMessageHandler}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>
                        <SearchCompanyInput setShops={setShops} />
                    </div>
                    <div>
                        <FormControl>
                            <InputLabel id="demo-simple-select-readonly-label">Type</InputLabel>
                            <MessageTypeSelect
                                value={messageType}
                                onChange={e => handleMessageTypeChange(e.target.value as string)}
                            >
                                {messageTypes.map(type => (
                                    <MenuItem value={type}>{type.toUpperCase()}</MenuItem>
                                ))}
                            </MessageTypeSelect>
                        </FormControl>
                    </div>
                    <div>
                        <SendMessageButton sendMessage={sendMessageHandler} />
                    </div>
                </div>
            </ComponentBackground>
        </Box>
    );
}
