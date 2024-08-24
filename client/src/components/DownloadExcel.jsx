// import axios from 'axios';

// // Function to handle the download of the Excel file
// const downloadExcel = async () => {
//     try {
//         // Make a GET request to the server to download the Excel file
//         const response = await axios.get('/api/students/download-excel', {
//             responseType: 'blob', // Specify the response type as blob to handle binary data
//             // blob = binary large object
//         });

//         // Create a URL for the blob response
//         const url = window.URL.createObjectURL(new Blob([response.data]));

//         // Create a temporary link element
//         const link = document.createElement('a');
//         link.href = url;

//         // Set the download attribute with the desired file name
//         link.setAttribute('download', 'Students.xlsx');

//         // Append the link to the document body
//         document.body.appendChild(link);

//         // Programmatically click the link to trigger the download
//         link.click();

//         // Remove the link from the document body
//         document.body.removeChild(link);
//     } catch (error) {
//         console.error('Error downloading the file', error);
//     }
// };

// export default downloadExcel;
