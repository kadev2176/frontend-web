import axios from 'axios';

const Backend_URL = 'https://shearnode.com/api/v1/';
// const Backend_URL = 'http://localhost:5050/';

export const getCompanyInfo = async (wallet) => {
    const res = await axios.get(`${Backend_URL}company/info/${wallet}`);
    // console.log(res);
    return res.data.data.doc;
}

export const login = async (data) => {
    try {
        const res = await axios.post(`${Backend_URL}company/auth`, data);
        // console.log(res);
        // updateCompanyStatus(res.data.data.doc);
        return res.data.data.doc;
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
        return null;
    }
}

export const registerCompany = async (data) => {
    try {
        const res = await axios.post(`${Backend_URL}company`, data);
        alert('successfully registered');
        // updateCompanyStatus(res.data.data.doc);
        return res.data.data.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const addProduct = async (data) => {
    try {
        await axios.post(`${Backend_URL}product`, data);
        alert('product successfully added');
    } catch(err) {
        console.log(err);
        alert('Failed: ' + err.response.data.message);
    }
}

export const getCompanyProducts = async (data) => {
    try {
        const res = await axios.post(`${Backend_URL}product/filter`, data);
        // console.log(res);
        return res.data.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const productMint =async (product_id, amount) => {
    try {
        const pres = await axios.post(`${Backend_URL}product/${product_id}/mint`, { amount });
        // console.log(pres);
        // const res = await axios.post(`${Backend_URL}qrcode/product`, { product_id, amount, offset: pres.data.offset });
        // console.log(res);
        // return res.data.data.data;
    } catch (err) {
        console.log(err);
    }
}

export const getQRcodes = async () => {
    try {
        const res = await axios.get(`${Backend_URL}qrcode`);
        console.log(res);
        return res.data.data.data;
    } catch (err) {
        console.log(err);
    }
}

export const getProductQRcodes = async (product_id) => {
    try {
        const res = await axios.post(`${Backend_URL}qrcode/product`, { product_id});
        return res.data.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const uploadFile = async (body) => {
    try {
        const res = await axios.post(`${Backend_URL}upload/single`, body);
        return res.data.url;
    } catch (error) {
        console.log(error);
        return '';
    }
}