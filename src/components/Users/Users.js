import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { useEffect, useState } from 'react';


import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState()

    const handleChange = (e, value) => {
        setPage(value);
        axios.get(`http://localhost:3001/api/users?_page=${value}&_limit=5`)
            .then(res => {
                setUsers(res.data.data)
            })
            .catch(err => console.log(err))
    };

    useEffect(() => {
        axios.get('http://localhost:3001/api/users?_page=1&_limit=5')
            .then(res => {
                setTotalPage(Math.ceil(res.data.pagination._totalRows / 5))
                setUsers(res.data.data)
            })
            .catch(err => console.log(err))
    }, [])

    const handleSearchByEmail = (e) => {
        axios.get(`http://localhost:3001/api/users/filter?email=${e.target.value}`)
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/api/users/${id}`)
            .then(
                axios.get(`http://localhost:3001/api/users?_page=${page}&_limit=5`)
                    .then(res => {
                        setUsers(res.data.data)
                        setTotalPage(Math.ceil(res.data.pagination._totalRows / 5))
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
    }

    return (
        <>
            <Box sx={{ margin: '40px auto', paddingLeft: '20px', border: '1px solid grey', width: '60%' }}>
                <Typography
                    variant="h6"
                    sx={{ padding: '20px 0' }}
                >
                    Danh sách người dùng
                </Typography>
                <Box sx={{ display: 'flex', paddingBottom: '10px' }}>
                    <Box
                        sx={{ border: '1px solid grey', padding: '4px 10px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                        <label>Tìm kiếm</label>
                    </Box>
                    <input onChange={handleSearchByEmail} style={{ width: '300px', borderBottomRightRadius: '8px', borderTopRightRadius: '8px' }} placeholder='gmail' />
                </Box>
                <TableContainer
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><Typography fontWeight="bold">#</Typography></TableCell>
                                <TableCell align="left"><Typography fontWeight="bold">Name</Typography></TableCell>
                                <TableCell align="left"><Typography fontWeight="bold">Email</Typography></TableCell>
                                <TableCell align="left"><Typography fontWeight="bold">Birthday</Typography></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 && users.map((user, ind) => (
                                <TableRow key={ind}>
                                    <TableCell align="center">{user.id}</TableCell>
                                    <TableCell align="left">{user.name}</TableCell>
                                    <TableCell align="left">{user.email}</TableCell>
                                    <TableCell align="left">{user.birthday}</TableCell>
                                    <TableCell align="center">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            style={{ backgroundColor: 'red', color: 'white', borderColor: 'white', padding: '6px 10px', borderRadius: '5px' }}
                                        >
                                            Xóa
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack spacing={2} sx={{ padding: '20px' }}>
                    <Pagination sx={{}} count={totalPage} page={page} onChange={handleChange} />
                </Stack>
            </Box>
        </>
    )
}

export default Users