import { Box, Button, ImageList, ImageListItem, Input, Table, TextField } from '@mui/material';
import react, { useEffect, useState } from 'react';
import { addProduct, getCompanyProducts, getProductQRcodes, login, productMint, registerCompany, uploadFile, uploadFiles } from '../helper';
import { DataGrid } from '@mui/x-data-grid';

const Page = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState(null);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productModel, setProductModel] = useState('');
    const [productDetail, setProductDetail] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mintAmount, setMintAmout] = useState(0);
    const [qrcodes, setQrCodes] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [productFiles, setProductFiles] = useState([]);
    const [productVideos, setProductVideos] = useState([]);
    const [updates, setUpdates] = useState(0);
    console.log(products);

    const loginHanlder = async () => {
        const res = await login({name, password});
        setCompany(res);
    }

    const registerHandler = async () => {
        const res = await registerCompany({name, password});
        setCompany(res);
    }

    const addProductHandler = async () => {
        if (productName == '' || productDetail == '' || productImages.length == 0) {
            alert('please fill all fields and upload an image');
            return;
        }
        await addProduct({name: productName, model: productModel, detail: productDetail, company_id: company._id, images:productImages, files: productFiles, videos: productVideos});
        const res = await getCompanyProducts({ company_id: company._id });
        const ptmp = res.map((p, i) => ({
            id: i + 1,
            ...p
        }));
        setProducts(ptmp);

        setProductName('');
        setProductModel('');
        setProductDetail('');
        setProductImages([]);
        setProductFiles([]);
        setProductVideos([]);
        setUpdates(0);
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
        { field: 'name', headerName: 'Brand Name', width: 150,
            renderCell: (data) => {
                return (<span style={{whiteSpace: "pre-line", padding: 10}}>{data.value}</span>);
            } 
        },
        { field: 'model', headerName: 'Model Designation', width: 150,
            renderCell: (data) => {
                return (<span style={{whiteSpace: "pre-line", padding: 10}}>{data.value}</span>);
            }
        },
        // { field: 'detail', headerName: 'Details', width: 200,
        //     renderCell: (data) => {
        //         return (<span style={{whiteSpace: "pre-line", padding: 10}}>{data.value}</span>);
        //     }
        // },
        // { field: 'image_url', headerName: 'Files', width: 200 },
        // { field: 'contract_address', headerName: 'Contract Address', width: 360 }
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
        event.stopPropagation();
        if (event.target.files && event.target.files.length) {
        //   const file = event.target.files[0];
        //   const body = new FormData();
        //   body.append("file", file);
        //   const res = await uploadFile(body);
          
            const body = new FormData();
            for (const single_file of event.target.files) {
                body.append("files", single_file);
            }
            const res = await uploadFiles(body);
            setProductImages(res);
        }
    };

    const handleProductFilesChange = async (event) => {
        event.stopPropagation();
        if (event.target.files && event.target.files.length) {
          
            const body = new FormData();
            for (const single_file of event.target.files) {
                body.append("files", single_file);
            }
            const res = await uploadFiles(body);
            setProductFiles(res);
        }
    };

    const handleProductVideoAddClick = () => {
        let temp = productVideos;
        temp.push({url: '', description: ''});
        setProductVideos(temp);
        setUpdates(updates + 1);
    }

    const handleProductVideoUrlChange = (e, i) => {
        let temp = productVideos;
        temp[i].url = e.target.value;
        setProductVideos(temp);
        setUpdates(updates + 1);
    }
    const handleProductVideoDescriptionChange = (e, i) => {
        let temp = productVideos;
        temp[i].description = e.target.value;
        setProductVideos(temp);
        setUpdates(updates + 1);
    }
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
                        <TextField id="outlined-basic" label="Brand Name" variant="outlined" size='small' value={productName} onChange={(e) => setProductName(e.target.value)} multiline/> &nbsp;
                        <br/><br/>
                        <TextField id="outlined-basic" label="Model Designation" variant="outlined" size='small' value={productModel} onChange={(e) => setProductModel(e.target.value)} multiline/> &nbsp;
                        <br/><br/>
                        <TextField id="outlined-basic" label="Details" variant="outlined" size='small' value={productDetail} onChange={(e) => setProductDetail(e.target.value)} multiline/> &nbsp;
                        <br/><br/>
                        Images: <input type='file' onChange={handleProductImageChange} multiple/>
                        <br/><br/>
                        Files: <input type='file' onChange={handleProductFilesChange} multiple/>
                        <br/><br/>
                        Youtube Videos: <Button variant='outlined' onClick={handleProductVideoAddClick}>+</Button>
                        <br/><br/>
                        {productVideos.map((video, i) => (
                            <>
                                <TextField key={i * 2} id="outlined-basic" label="Url..." variant="outlined" size='small' value={video.url} onChange={(e) => handleProductVideoUrlChange(e, i)} /> &nbsp;
                                <TextField key={i * 2 + 1} id="outlined-basic" label="Description" variant="outlined" size='small' value={video.description} onChange={(e) => handleProductVideoDescriptionChange(e, i)} /> &nbsp;
                                <br/><br/>
                            </>
                        ))}
                        <Button variant='outlined' onClick={addProductHandler} disabled={!(productName != '' && productDetail != '' && productImages.length > 0)}>Add Product</Button>
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
                            sx={{ }}
                            onCellClick={(e)=> productSelectHandler(e.row)}
                            getRowHeight={() => 'auto'}
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