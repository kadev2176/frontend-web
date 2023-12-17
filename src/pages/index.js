import { Box, Button, ImageList, ImageListItem, Input, Table, TextField } from '@mui/material';
import react, { useEffect, useState } from 'react';
import { addProduct, getCompanyProducts, getProductQRcodes, login, productMint, registerCompany, uploadFile } from '../helper';
import { DataGrid } from '@mui/x-data-grid';

const Page = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState(null);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDetail, setProductDetail] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mintAmount, setMintAmout] = useState(0);
    const [qrcodes, setQrCodes] = useState([]);
    const [productImage, setProductImage] = useState('');

    const loginHanlder = async () => {
        const res = await login({name, password});
        setCompany(res);
    }

    const registerHandler = async () => {
        const res = await registerCompany({name, password});
        setCompany(res);
    }

    const addProductHandler = async () => {
        await addProduct({name: productName, detail: productDetail, company_id: company._id, image_url: productImage});
        const res = await getCompanyProducts({ company_id: company._id });
        const ptmp = res.map((p, i) => ({
            id: i + 1,
            ...p
        }));
        setProducts(ptmp);
    }

    useEffect(() => {
        if(company) {
            (async () => { 
                const res = await getCompanyProducts({ company_id: company._id });
                const ptmp = res.map((p, i) => ({
                    id: i + 1,
                    ...p
                }));
                setProducts(ptmp);
            })()
        }
    }, [company]);

    const productColumns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'detail', headerName: 'Details', width: 200 },
        { field: 'image_url', headerName: 'Image Url', width: 300 },
        { field: 'contract_address', headerName: 'Contract Address', width: 360 }
    ];

    const productSelectHandler = (data) => {
        setSelectedProduct(data);
    }
    
    const batchMintHandler = async () => {
        await productMint(selectedProduct._id,  parseInt(mintAmount, 10));
        const res = await getProductQRcodes(selectedProduct._id);
        setQrCodes(res);
    }

    useEffect(() => {
        if(selectedProduct) {
            (async () => {
                const res = await getProductQRcodes(selectedProduct._id);
                setQrCodes(res);
            })()
        }
    }, [selectedProduct]);

    const handleProductImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const body = new FormData();
          body.append("file", file);
          const res = await uploadFile(body);
          setProductImage(res);
        }
      };

    return (
        <Box sx={{ p: 5 }}>
            {!company
                ? <Box sx={{ p: 2 }}>
                        <br/><br/>
                        <TextField id="outlined-basic" label="name" variant="outlined" size='small' value={name} onChange={(e) => setName(e.target.value)}/>
                        <br/><br/>
                        <TextField id="outlined-basic" label="password" variant="outlined" size='small' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <br/><br/>
                        <Button variant='outlined' onClick={loginHanlder}>Login</Button> &nbsp;
                        <Button variant='outlined' onClick={registerHandler}>Register</Button>
                </Box>
                : <>
                    <Box sx={{ pb: 2 }}>
                        Company: {company.name}
                    </Box>
                    <Box sx={{ pb: 2 }}>
                        Products
                        <br/><br/>
                        <TextField id="outlined-basic" label="Name" variant="outlined" size='small' value={productName} onChange={(e) => setProductName(e.target.value)}/> &nbsp;
                        <TextField id="outlined-basic" label="Detail" variant="outlined" size='small' value={productDetail} onChange={(e) => setProductDetail(e.target.value)}/> &nbsp;
                        <Input type='file' onChange={handleProductImageChange}/>
                        <Button variant='outlined' onClick={addProductHandler}>Add Product</Button>
                        <br/><br/>
                        <DataGrid
                            rows={products}
                            columns={productColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            sx={{ width: 900 }}
                            onCellClick={(e)=> productSelectHandler(e.row)}
                        />
                    </Box>
                    
                    {selectedProduct && <Box>
                        <Box>
                            Mint
                            <br/><br/>
                            <TextField id="outlined-basic" label="amount" variant="outlined" size='small' value={mintAmount} onChange={(e) => setMintAmout(e.target.value)}/> &nbsp;
                            <Button variant='outlined' onClick={batchMintHandler}>Mint</Button>
                        </Box>
                        <Box sx={{ pt: 2 }}>
                            Qr Codes for Selected Product <br/>
                            Count: {selectedProduct.total_minted_amount}
                            <ImageList sx={{ width: 1200, height: 450 }} cols={5} rowHeight={230}>
                                {qrcodes.map((item, i) => (
                                    <ImageListItem key={i}>
                                        <img
                                            // srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${item.image}`}
                                            // alt={item.title}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </Box>}
                </>
            }
        </Box>
    );
}

export default Page;