/* eslint-disable no-underscore-dangle */
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from '@mui/material/Card';
import {
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { Mutations, Queries } from '../../../query/query-client';

type KeywordGroup = {
    _id?: string;
    keywords: string[];
    appHandlers: string[];
};

function ItemLine({
    item,
    deleteKeywordGroup,
    saveKeywordGroup,
    addKeyword,
    deleteKeyword,
    addAppHandle,
    deleteAppHandle,
}: Readonly<{
    item: KeywordGroup;
    deleteKeywordGroup: (id: string) => void;
    saveKeywordGroup: (id: string) => void;
    addKeyword: (data: { keyword: string; groupId: string }) => void;
    deleteKeyword: (data: { keyword: string; groupId: string }) => void;
    addAppHandle: (data: { appHandle: string; groupId: string }) => void;
    deleteAppHandle: (data: { appHandle: string; groupId: string }) => void;
}>) {
    const [newKeyword, setNewKeyword] = useState('');
    const [newAppHandler, setNewAppHandler] = useState('');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                border: '1px solid #b6b6b6ff',
                padding: 10,
                boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                justifyContent: 'space-between',
                minWidth: '100%',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    {item.keywords.map(k => (
                        <Chip label={k} key={k} onDelete={() => deleteKeyword({ keyword: k, groupId: item._id })} />
                    ))}
                    <TextField
                        label="Add Keyword"
                        variant="outlined"
                        size="small"
                        value={newKeyword}
                        onChange={e => setNewKeyword(e.target.value)}
                        onBlur={e => {
                            addKeyword({ keyword: e.target.value, groupId: item._id });
                            setNewKeyword('');
                        }}
                    />
                </div>

                <div>
                    {item.appHandlers.map(a => (
                        <Chip label={a} key={a} onDelete={() => deleteAppHandle({ appHandle: a, groupId: item._id })} />
                    ))}
                    <TextField
                        label="Add App Handler"
                        variant="outlined"
                        size="small"
                        value={newAppHandler}
                        onChange={e => setNewAppHandler(e.target.value)}
                        onBlur={e => {
                            addAppHandle({ appHandle: e.target.value, groupId: item._id });
                            setNewAppHandler('');
                        }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button color="success" onClick={() => saveKeywordGroup(item._id)}>
                    Save
                </Button>
                <Button color="error" onClick={() => deleteKeywordGroup(item._id)} disabled={!item._id}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

export function KeywordGroups() {
    const [items, setItems] = useState<KeywordGroup[]>([]);
    const saveToastId = useRef<Id | null>(null);
    const deleteToastId = useRef<Id | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<string | false>(false);

    const { mutate, isError, isSuccess, error } = useMutation<KeywordGroup[], Error, KeywordGroup[]>({
        mutationKey: [Mutations.SHOPIFY_SET_KEYWORDS_LIST],
    });

    const {
        mutate: deleteKeywordGroup,
        isError: isDeleteError,
        isSuccess: isDeleteSuccess,
        error: deleteError,
    } = useMutation<string, Error, string>({
        mutationKey: [Mutations.SHOPIFY_DELETE_KEYWORD_GROUP],
    });

    const { data, isLoading } = useQuery<unknown, unknown, KeywordGroup[]>({
        queryKey: [Queries.SHOPIFY_GET_KEYWORDS_LIST],
    });

    const deleteKeywordGroupHandler = (id: string) => {
        deleteKeywordGroup(id);
        deleteToastId.current = toast.loading('Deleting keyword group...');
        setOpenDeleteDialog(false);
    };

    const addKeywordGroupHandler = () => {
        mutate([{ keywords: [], appHandlers: [] }]);
    };

    const deleteKeyword = ({ keyword, groupId }: { keyword: string; groupId: string }) => {
        setItems(prev =>
            prev.map(item =>
                item._id === groupId ? { ...item, keywords: item.keywords.filter(k => k !== keyword) } : item
            )
        );
    };

    const deleteAppHandle = ({ appHandle, groupId }: { appHandle: string; groupId: string }) => {
        setItems(prev =>
            prev.map(item =>
                item._id === groupId ? { ...item, appHandlers: item.appHandlers.filter(a => a !== appHandle) } : item
            )
        );
    };

    const addKeyword = ({ keyword, groupId }: { keyword: string; groupId: string }) => {
        if (!keyword.trim()) return;
        setItems(prev =>
            prev.map(item =>
                item._id === groupId
                    ? { ...item, keywords: Array.from(new Set([...item.keywords, keyword.trim()])) }
                    : item
            )
        );
    };

    const addAppHandle = ({ appHandle, groupId }: { appHandle: string; groupId: string }) => {
        if (!appHandle.trim()) return;
        setItems(prev =>
            prev.map(item =>
                item._id === groupId
                    ? { ...item, appHandlers: Array.from(new Set([...item.appHandlers, appHandle.trim()])) }
                    : item
            )
        );
    };

    const saveChangesHandler = (id: string) => {
        const toSave = items.filter(item => item._id === id);
        if (toSave.length === 0) {
            return;
        }
        mutate(toSave);
        saveToastId.current = toast.loading('Saving keyword groups...');
    };

    useEffect(() => {
        if (data) {
            setItems(data);
        }
    }, [data]);

    useEffect(() => {
        if (saveToastId.current) {
            if (isError) {
                toast.update(saveToastId.current, {
                    render: error.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                });
            } else if (isSuccess) {
                toast.update(saveToastId.current, {
                    render: 'Keyword groups saved successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        }
    }, [isError, isSuccess, error]);

    useEffect(() => {
        if (deleteToastId.current) {
            if (isDeleteError) {
                toast.update(deleteToastId.current, {
                    render: deleteError.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                });
            } else if (isDeleteSuccess) {
                toast.update(deleteToastId.current, {
                    render: 'Keyword group deleted successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        }
    }, [isDeleteError, isDeleteSuccess, deleteError]);

    return (
        <Card
            variant="outlined"
            sx={{
                padding: '10px',
                marginBottom: '20px',
                border: 'solid 1px #b6b6b6ff',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div style={{ minWidth: '100%' }}>
                    <div>
                        {items.map(item => (
                            <ItemLine
                                key={item._id}
                                item={item}
                                deleteKeywordGroup={setOpenDeleteDialog}
                                saveKeywordGroup={saveChangesHandler}
                                addAppHandle={addAppHandle}
                                deleteAppHandle={deleteAppHandle}
                                addKeyword={addKeyword}
                                deleteKeyword={deleteKeyword}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <Button variant="contained" color="success" onClick={addKeywordGroupHandler}>
                            Add Keyword Group
                        </Button>
                    </div>
                </div>
            )}
            <Dialog open={Boolean(openDeleteDialog)} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs">
                <DialogTitle id="alert-dialog-title">Confirm the action</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete this keyword group? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => deleteKeywordGroupHandler(openDeleteDialog as string)}
                        autoFocus
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
