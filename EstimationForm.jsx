// import React, { useState, useEffect } from 'react';
// import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Checkbox, OutlinedInput, Chip, Autocomplete } from '@mui/material';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { makeStyles } from '@mui/styles';
// import axios from 'axios';

// const useStyles = makeStyles({
//   formContainer: {
//     width: '100%',
//     padding: '20px',
//   },
//   textField: {
//     marginBottom: '16px',
//   },
//   formControl: {
//     marginBottom: '16px',
//     minWidth: 120,
//   },
//   vendorHeader: {
//     width: '200px',  // Fixed width for vendor header
//   },
//   termsContainer: {
//     marginTop: '20px',
//     padding: '10px',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'wrap', // Allows wrapping to a new row when vendors are added
//     justifyContent: 'flex-end',
//     gap: '10px',
//     overflow: 'hidden', // Avoids any scrollbar
//   },
//   termsBox: {
//     padding: '10px',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     width: '576px', // Match the vendor header width
//   },
//   tableContainer: {
//     maxHeight: 'auto', // Allow the table to grow naturally without a scrollbar
//     // overflow: 'hidden', // No scrollbars
//     marginTop: '20px',
//   },
//   tableHeaderCell: {
//     minWidth: '120px',
//   },
//   tableCell: {
//     padding: '8px',
//   },
//   button: {
//     marginTop: '16px',
//     justifyContent: 'flex-end',
//   },
// });

// const EstimationForm = () => {
//   const { rfq_no } = useParams();
//   const classes = useStyles();
//   const [vendorCount, setVendorCount] = useState(0);
//   const [materials, setMaterials] = useState([
//     { material_code: '', description: '', qty: '', uom: '', unit_price: '', total_amount: '', final_deviation: '', final_vendor: '' },
//   ]);
//   const [vendors, setVendors] = useState({});
//   const [location, setLocation] = useState('');
//   const [clientRefNo, setClientRefNo] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [noDeviation, setNoDeviation] = useState(false);
//   const [vendorList, setVendorList] = useState([]);
//   const [vendorName, setVendorName] = useState('');
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [selectedVendorIndex, setSelectedVendorIndex] = useState(null);
//   const [newVendorRows, setNewVendorRows] = useState([]);
//   const [priceBasis, setPriceBasis] = useState('');
//   const [deliveryTime, setDeliveryTime] = useState('');
//   const [paymentTerm, setPaymentTerm] = useState('');
//   const [packaging, setPackaging] = useState('');
//   const [validity, setValidity] = useState('');
//   const [mtc, setMtc] = useState('');
//   const [tpi, setTpi] = useState('');

//   useEffect(() => {
//     axios
//       .get('http://localhost:3000/api/vendor-name') // Adjust the URL to match your API route
//       .then((response) => {
//         setVendorList(response.data); // Assuming response.data is an array of vendor names
//       })
//       .catch((error) => console.error('Error fetching vendors:', error));
//   }, []);

//   const handleVendorInputChange = (materialIndex, vendorIndex, field, value) => {
//     setVendors((prevState) => {
//       const updatedVendors = { ...prevState };
//       if (field === 'vendor_name') {
//         materials.forEach((_, matIndex) => {
//           updatedVendors[matIndex] = {
//             ...updatedVendors[matIndex],
//             [`vendor_${vendorIndex}`]: {
//               ...(updatedVendors[matIndex]?.[`vendor_${vendorIndex}`] || {}),
//               [field]: value,
//             },
//           };
//         });
//       } else {
//         updatedVendors[materialIndex] = {
//           ...updatedVendors[materialIndex],
//           [`vendor_${vendorIndex}`]: {
//             ...(updatedVendors[materialIndex]?.[`vendor_${vendorIndex}`] || {}),
//             [field]: value,
//           },
//         };
//       }
//       return updatedVendors;
//     });
//   };

//   // Add a new row when the "Add New Vendor" button is clicked
//   const handleAddNewVendorRow = () => {
//     setNewVendorRows((prevRows) => [...prevRows, {}]); // Add a new empty object for the new vendor row
//     setVendorCount((prevCount) => prevCount + 1); // Increment vendor count
//   };


//   const handleAddVendorColumns = () => {
//     setVendorCount(vendorCount + 1);
//   };

//   // Handle vendor selection from the dropdown
//   const handleVendorChange = (event) => {
//     const selectedVendorNames = event.target.value;
//     setSelectedVendors(selectedVendorNames);
//   };

//   const checkNoDeviation = () => {
//     if (!noDeviation) return;

//     const updatedMaterials = [...materials];

//     updatedMaterials.forEach((material, rowIndex) => {
//       let selectedUnitPrice = Infinity;
//       let selectedVendor = null;
//       const currentVendors = vendors[rowIndex] || {};

//       // Get vendor entries with their actual names from the vendor name column
//       const vendorEntries = Object.entries(currentVendors).map(([key, vendorData]) => {
//         const vendorIndex = parseInt(key.replace('vendor_', ''));
//         return {
//           ...vendorData,
//           actualName: vendorIndex < selectedVendors.length ? selectedVendors[vendorIndex] : vendorData.vendor_name
//         };
//       });

//       // Step 1: Filter vendors with blank deviation
//       const noDeviationVendors = vendorEntries.filter(vendor => !vendor.deviation);

//       // Step 2: If no-deviation vendors exist, choose the one with the lowest unit price
//       if (noDeviationVendors.length > 0) {
//         noDeviationVendors.forEach((vendor) => {
//           const unitValue = parseFloat(vendor.unit || Infinity);
//           if (unitValue < selectedUnitPrice) {
//             selectedUnitPrice = unitValue;
//             selectedVendor = vendor;
//           }
//         });
//       } else {
//         // Step 3: If all vendors have a deviation, choose the one with the lowest unit price
//         vendorEntries.forEach((vendor) => {
//           const unitValue = parseFloat(vendor.unit || Infinity);
//           if (unitValue < selectedUnitPrice) {
//             selectedUnitPrice = unitValue;
//             selectedVendor = vendor;
//           }
//         });
//       }

//       if (selectedVendor) {
//         material.unit_price = selectedVendor.unit || '';
//         material.total_amount = (parseFloat(material.qty) * parseFloat(selectedVendor.unit)).toString() || '';
//         material.final_deviation = selectedVendor.deviation || '';
//         material.final_vendor = selectedVendor.actualName || ''; // Use the actual vendor name
//       }
//     });

//     setMaterials(updatedMaterials);
//   };

//   useEffect(() => {
//     checkNoDeviation();
//   }, [noDeviation, vendors, materials]);

//   const handleCheckboxChange = (event) => {
//     setNoDeviation(event.target.checked);
//   };


//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const estimationData = {
//       rfq_no,
//       materials: materials.map(material => ({
//         materialCode: material.material_code,
//         description: material.description,
//         qty: material.qty,
//         uom: material.uom,
//         unitPrice: material.unit_price,
//         totalAmount: material.total_amount,
//         finalDeviation: material.final_deviation,
//         finalVendor: material.final_vendor,
//         status: 'Submitted'
//       }))
//     };

//     console.log('Submitting data:', estimationData); // Debug log

//     axios.post('http://localhost:3000/api/estimation', estimationData)
//       .then(response => {
//         console.log('Success:', response.data);
//         alert('Data submitted successfully!');
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         alert('Error submitting data. Please try again.');
//       });
//     handleSubmitVendor();
//     handleSubmitTerms();
//   };

//   const handleSubmitVendor = async () => {
//     const vendorData = [];

//     // Iterate through materials
//     materials.forEach((material, materialIndex) => {
//       // Iterate through selected vendors
//       selectedVendors.forEach((vendorName, vendorIndex) => {
//         const vendorInfo = vendors[materialIndex]?.[`vendor_${vendorIndex}`] || {};
//         const unit = vendorInfo.unit || '';
//         const total = material.qty * parseFloat(unit) || 0;

//         vendorData.push({
//           rfq_no,
//           vendorName, // Changed from vendor_name to match backend
//           materialCode: material.material_code, // Added material_code
//           unit: unit,
//           total: total.toString(),
//           deviation: vendorInfo.deviation || '',
//         });
//       });
//     });

//     try {
//       await axios.post('http://localhost:3000/api/vendor', vendorData);
//       console.log('Vendor data submitted successfully');
//     } catch (error) {
//       console.error('Error submitting vendor data:', error);
//     }
//   };


//   const handleSubmitTerms = async () => {
//     const termsData = [];

//     // Iterate through selected vendors
//     selectedVendors.forEach((vendorName, vendorIndex) => {
//       const vendorInfo = vendors[0]?.[`vendor_${vendorIndex}`] || {};

//       termsData.push({
//         rfq_no,
//         vendor_name: vendorName, // Use the selected vendor name
//         price_basis: vendorInfo.price_basis || '',
//         delivery_time: vendorInfo.delivery_time || '',
//         payment_terms: vendorInfo.payment_terms || '',
//         packaging: vendorInfo.packaging || '',
//         validity: vendorInfo.validity || '',
//         mtc: vendorInfo.mtc || '',
//         tpi: vendorInfo.tpi || '',
//       });
//     });

//     try {
//       await axios.post('http://localhost:3000/api/term-condition', termsData);
//       console.log('Terms and conditions submitted successfully');
//     } catch (error) {
//       console.error('Error submitting terms and conditions:', error);
//     }
//   };


//   useEffect(() => {
//     if (rfq_no) {
//       console.log('Fetching details for Inquiry:', rfq_no);

//       axios
//         .post('http://localhost:3000/api/inquiry-details', { query: 'SELECT * FROM solitaire WHERE rfq_no = ?', params: [rfq_no] })
//         .then((response) => {
//           if (response.data.length > 0) {
//             const { location, due_date, client_ref_no } = response.data[0];
//             setDueDate(due_date);
//             setClientRefNo(client_ref_no);
//             setLocation(location);
//           } else {
//             alert('Contact person or client not found.');
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching contact details:', error);
//           alert('An error occurred while fetching contact details.');
//         });
//     }
//   }, [rfq_no]);

//   useEffect(() => {
//     if (rfq_no) {
//       console.log('Fetching details for Inquiry:', rfq_no);

//       axios
//         .post('http://localhost:3000/api/estimation-material', { query: 'SELECT * FROM amardeep WHERE rfq_no = ?', params: [rfq_no] })
//         .then((response) => {
//           if (response.data.length > 0) {
//             // Assuming response.data is an array of material objects
//             const fetchedMaterials = response.data.map((item) => ({
//               material_code: item.material_code,
//               description: item.description,
//               qty: item.qty,
//               uom: item.uom,
//             }));

//             setMaterials(fetchedMaterials);
//           } else {
//             alert('No materials found for this RFQ.');
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching material details:', error);
//           alert('An error occurred while fetching material details.');
//         });
//     }
//   }, [rfq_no]);

//   const handleEstimationSave = (event) => {
//     event.preventDefault();

//     const estimationDataSaved = {
//       rfq_no,
//       materials: materials.map(material => ({
//         materialCode: material.material_code,
//         description: material.description,
//         qty: material.qty,
//         uom: material.uom,
//         unitPrice: material.unit_price,
//         totalAmount: material.total_amount,
//         finalDeviation: material.final_deviation,
//         finalVendor: material.final_vendor,
//         status: 'Saved'
//       }))
//     };

//     console.log('Submitting data:', estimationDataSaved); // Debug log

//     axios.post('http://localhost:3000/api/estimation-saved', estimationDataSaved)
//       .then(response => {
//         console.log('Success:', response.data);
//         alert('Data Saved successfully!');
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         alert('Error saved data. Please try again.');
//       });
//     handleSavedVendor();
//     handleSavedTerms();
//   };

//   const handleSavedVendor = async () => {
//     const vendorDataSaved = [];

//     // Iterate through materials
//     materials.forEach((material, materialIndex) => {
//       // Iterate through selected vendors
//       selectedVendors.forEach((vendorName, vendorIndex) => {
//         const vendorInfo = vendors[materialIndex]?.[`vendor_${vendorIndex}`] || {};
//         const unit = vendorInfo.unit || '';
//         const total = material.qty * parseFloat(unit) || 0;

//         vendorDataSaved.push({
//           rfq_no,
//           vendorName, // Changed from vendor_name to match backend
//           materialCode: material.material_code, // Added material_code
//           unit: unit,
//           total: total.toString(),
//           deviation: vendorInfo.deviation || '',
//           flag: 'Saved',
//         });
//       });
//     });

//     try {
//       await axios.post('http://localhost:3000/api/vendor-saved', vendorDataSaved);
//       console.log('Vendor data saved successfully');
//     } catch (error) {
//       console.error('Error saved vendor data:', error);
//     }
//   };


//   const handleSavedTerms = async () => {
//     const termsDataSaved = [];

//     // Iterate through selected vendors
//     selectedVendors.forEach((vendorName, vendorIndex) => {
//       const vendorInfo = vendors[0]?.[`vendor_${vendorIndex}`] || {};

//       termsDataSaved.push({
//         rfq_no,
//         vendor_name: vendorName, // Use the selected vendor name
//         price_basis: vendorInfo.price_basis || '',
//         delivery_time: vendorInfo.delivery_time || '',
//         payment_terms: vendorInfo.payment_terms || '',
//         packaging: vendorInfo.packaging || '',
//         validity: vendorInfo.validity || '',
//         mtc: vendorInfo.mtc || '',
//         tpi: vendorInfo.tpi || '',
//         status: 'Saved',
//       });
//     });

//     try {
//       await axios.post('http://localhost:3000/api/term-condition-saved', termsDataSaved);
//       console.log('Terms and conditions saved successfully');
//     } catch (error) {
//       console.error('Error saved terms and conditions:', error);
//     }
//   };

//   /// estimation Saved Part here 
//   const [EstimationDataSaved, setEstimationDataSaved] = useState([]);
//   // const [TermConditionData, setTermsConditions] = useState([]);
//   const [VendorDataSaved, setVendorDataSaved] = useState([]);
//   const [TermConditionDataSaved, setTermsConditionsSaved] = useState([]);

//   const fetchEstimationDataSaved = () => {
//     axios.get(`http://localhost:3000/api/estimation-data-saved`, { params: { rfq_no } })
//       .then(response => setEstimationDataSaved(response.data),
//       )
//       .catch(error => console.error('Fetch error:', error));
//   };

//   const fetchVendorDataSaved = () => {
//     axios.get(`http://localhost:3000/api/estimation-vendor-saved`, { params: { rfq_no } })
//       .then(response => setVendorDataSaved(response.data),
//       )
//       .catch(error => console.error('Fetch error:', error));
//   };

//   const fetchTermsConditionData = () => {
//     axios.get(`http://localhost:3000/api/estimation-terms-condition-saved`, { params: { rfq_no } })
//       .then(response =>
//         setTermsConditionsSaved(response.data)
//       )
//       .catch(error => console.error('Fetch error:', error));
//   };

//   useEffect(() => {
//     fetchEstimationDataSaved();
//   }, []);

//   useEffect(() => {
//     fetchVendorDataSaved();
//   }, []);


//   useEffect(() => {
//     fetchTermsConditionData();
//   }, []);

//   return (
//     <Box component="form" onSubmit={handleSubmit} className={classes.formContainer}>
//       <Box style={{ padding: '20px', marginTop: '20px', marginLeft: '20pc', width: '50%', position: 'flex', border: '1px solid gray' }}>
//         <Typography variant="h5" gutterBottom>Solitaire Estimation</Typography>
//         <TextField
//           label="RFQ No."
//           value={rfq_no}
//           fullWidth
//           margin="normal"
//           InputProps={{ readOnly: true }}
//           className={classes.textField}
//         />
//         <TextField
//           label="Client Ref No"
//           value={clientRefNo}
//           onChange={(e) => setClientRefNo(e.target.value)}
//           fullWidth
//           InputProps={{ readOnly: true }}
//           margin="normal"
//           className={classes.textField}
//         />
//         <TextField
//           label="Location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           fullWidth
//           InputProps={{ readOnly: true }}
//           margin="normal"
//           className={classes.textField}
//         />
//         <TextField
//           label="Due Date"
//           value={dueDate}
//           onChange={(e) => setDueDate(e.target.value)}
//           fullWidth
//           InputProps={{ readOnly: true }}
//           margin="normal"
//           InputLabelProps={{ shrink: true }}
//           className={classes.textField}
//         />
//         {/* <FormControl fullWidth style={{ marginBottom: '20px' }}>
//         <InputLabel id="vendor-label">Select Vendor(s)</InputLabel>
//         <Select
//           labelId="vendor-label"
//           multiple
//           value={selectedVendors}
//           onChange={handleVendorChange}
//           input={<OutlinedInput label="Select Vendor(s)" />}
//           renderValue={(selected) => (
//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//               {selected.map((value) => (
//                 <Chip key={value} label={value} />
//               ))}
//             </Box>
//           )}
//         >
//           {vendorList.map((vendor, index) => (
//             <MenuItem key={index} value={vendor.vendor_name}>
//               {vendor.vendor_name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <br />

//       <FormControlLabel
//       control={
//         <Checkbox
//           checked={noDeviation}
//           onChange={handleCheckboxChange}
//         />
//       }
//       label="Select Vendor With no Deviation"
//     />
//       <br /> */}

//         {/* <FormControl fullWidth style={{ marginBottom: '20px' }}>
//   <InputLabel id="vendor-label">Select Vendor(s)</InputLabel>
//   <Select
//     labelId="vendor-label"
//     multiple
//     value={selectedVendors}
//     onChange={handleVendorChange}
//     input={<OutlinedInput label="Select Vendor(s)" />}
//     renderValue={(selected) => (
//       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//         {selected.map((value) => (
//           <Chip key={value} label={value} />
//         ))}
//       </Box>
//     )}
//   >
//     {vendorList.map((vendor, index) => (
//       <MenuItem key={index} value={vendor.vendor_name}>
//         {vendor.vendor_name}
//       </MenuItem>
//     ))}
//   </Select>
// </FormControl> */}

//         <Autocomplete
//           fullWidth
//           style={{ marginBottom: '20px' }}
//           multiple
//           options={vendorList.map((vendor) => vendor.vendor_name)}
//           value={selectedVendors}
//           onChange={(event, newValue) => setSelectedVendors(newValue)}
//           renderInput={(params) => <TextField {...params} label="Select Vendor(s)" />}
//         />

//         <br />

//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={noDeviation}
//               onChange={handleCheckboxChange}
//             />
//           }
//           label="Select Vendor With no Deviation"
//         />
//         <br />

//       </Box>


//       {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
//         <Button variant="contained" color="primary" onClick={handleAddNewVendorRow} className={classes.button}>
//           Add New Vendor
//         </Button>
//       </Box>
//       <br /> */}
//       <TableContainer component={Paper} className={classes.tableContainer}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>MATERIAL CODE</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>SR No</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>DESCRIPTION</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>QTY</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>UOM</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>UNIT PRICE</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>Total AMOUNT</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>Final Deviation</TableCell>
//               <TableCell className={classes.tableHeaderCell} rowSpan={2}>Final Vendor</TableCell>

//               {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, i) => (
//                 <TableCell key={i} colSpan={4} className={classes.vendorHeader}>
//                   {i < selectedVendors.length ? "Vendor (Selected)" : `New Vendor ${i - selectedVendors.length + 1}`}
//                   <TextField
//                     required
//                     fullWidth
//                     margin="normal"
//                     value={i < selectedVendors.length ? selectedVendors[i] || '' : vendors[0]?.[`vendor_${i}`]?.vendor_name || ''}
//                     // disabled={i < selectedVendors.length} // Disable if it's from the dropdown
//                     onChange={(e) => handleVendorInputChange(0, i, 'vendor_name', e.target.value)} // Manually add new vendor names
//                   />
//                 </TableCell>
//               ))}
//             </TableRow>
//             <TableRow>

//               {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, i) => (
//                 <React.Fragment key={i}>
//                   <TableCell className={classes.tableHeaderCell}>Vendor Name</TableCell>
//                   <TableCell className={classes.tableHeaderCell}>Unit</TableCell>
//                   <TableCell className={classes.tableHeaderCell}>Total</TableCell>
//                   <TableCell className={classes.tableHeaderCell}>Deviation</TableCell>
//                 </React.Fragment>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {materials.map((material, materialIndex) => (
//               <TableRow key={materialIndex}>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.material_code} fullWidth disabled />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>{materialIndex + 1}</TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.description} fullWidth disabled />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.qty} fullWidth disabled />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.uom} fullWidth disabled />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField
//                     value={material.unit_price || 0}
//                     onChange={(e) => {
//                       const updatedMaterials = [...materials];
//                       updatedMaterials[materialIndex].unit_price = e.target.value;
//                       setMaterials(updatedMaterials);
//                     }}
//                     fullWidth
//                   />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.qty * material.unit_price || ''} fullWidth disabled />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.final_deviation} fullWidth disabled />
//                 </TableCell>
//                 <TableCell className={classes.tableCell}>
//                   <TextField value={material.final_vendor} fullWidth disabled />
//                 </TableCell>
//                 {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, vendorIndex) => (
//                   <React.Fragment key={vendorIndex}>
//                     <TableCell className={classes.tableCell}>
//                       <TextField
//                         value={
//                           vendorIndex < selectedVendors.length
//                             ? selectedVendors[vendorIndex] || '' // For selected vendor from dropdown
//                             : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.vendor_name || '' // For manually typed vendors
//                         }
//                         onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'vendor_name', e.target.value)}
//                         fullWidth
//                       // disabled={vendorIndex < selectedVendors.length} // Disable input for dropdown-selected vendors
//                       />
//                     </TableCell>
//                     <TableCell className={classes.tableCell}>
//                       <TextField
//                         value={vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
//                         onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'unit', e.target.value)}
//                         fullWidth

//                       />
//                     </TableCell>
//                     <TableCell className={classes.tableCell}>
//                       <TextField
//                         value={material.qty * vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell className={classes.tableCell}>
//                       <TextField
//                         value={vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.deviation || ''}
//                         onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'deviation', e.target.value)}
//                         fullWidth
//                       />
//                     </TableCell>
//                   </React.Fragment>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Terms and Conditions sections */}
//       <Box className={classes.termsContainer}>
//         {/* Display for selected vendors */}
//         {selectedVendors.map((vendor, index) => (
//           <Box key={index} className={classes.termsBox}>
//             <Typography variant="h6">Terms and Conditions ({vendor})</Typography>
//             <TextField
//               label="Price Basis"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.price_basis || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'price_basis', e.target.value)}
//             />
//             <TextField
//               label="Delivery Time"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.delivery_time || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'delivery_time', e.target.value)} // Update delivery time state
//             />
//             <TextField
//               label="Payment Terms"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.payment_terms || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'payment_terms', e.target.value)} // Update payment terms state
//             />
//             <TextField
//               label="Packaging"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.packaging || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'packaging', e.target.value)} // Update packaging state
//             />
//             <TextField
//               label="Validity"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.validity || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'validity', e.target.value)} // Update validity state
//             />
//             <TextField
//               label="MTC"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.mtc || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'mtc', e.target.value)} // Update MTC state 
//             />
//             <TextField
//               label="TPI"
//               fullWidth
//               margin="normal"
//               value={vendors[0]?.[`vendor_${index}`]?.tpi || ''}
//               onChange={(e) => handleVendorInputChange(0, index, 'tpi', e.target.value)} // Update TPI state
//             />
//           </Box>
//         ))}

//       </Box>
//       <Button onClick={handleEstimationSave} variant="contained" color="primary" className={classes.button} style={{ marginTop: '10px' }}>Save</Button>
//       <Button type="submit" variant="contained" color="primary" className={classes.button} style={{ marginTop: '10px', marginLeft: '10px' }}>Submit</Button>

//     </Box>
//   );
// };

// export default EstimationForm; 




import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Checkbox, OutlinedInput, Chip, Autocomplete } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

const useStyles = makeStyles({
  formContainer: {
    width: '100%',
    padding: '20px',
  },
  textField: {
    marginBottom: '16px',
  },
  formControl: {
    marginBottom: '16px',
    minWidth: 120,
  },
  vendorHeader: {
    width: '200px',  // Fixed width for vendor header
  },
  termsContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows wrapping to a new row when vendors are added
    justifyContent: 'flex-end',
    gap: '10px',
    overflow: 'hidden', // Avoids any scrollbar
  },
  termsBox: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '576px', // Match the vendor header width
  },
  tableContainer: {
    maxHeight: 'auto', // Allow the table to grow naturally without a scrollbar
    // overflow: 'hidden', // No scrollbars
    marginTop: '20px',
  },
  tableHeaderCell: {
    minWidth: '120px',
  },
  tableCell: {
    padding: '8px',
  },
  button: {
    marginTop: '16px',
    justifyContent: 'flex-end',
  },
});

const EstimationForm = () => {
  const { rfq_no } = useParams();
  const classes = useStyles();
  const [vendorCount, setVendorCount] = useState(0);
  const [materials, setMaterials] = useState([
    { material_code: '', description: '', qty: '', uom: '', unit_price: '', total_amount: '', final_deviation: '', final_vendor: '' },
  ]);
  const [vendors, setVendors] = useState({});
  const [location, setLocation] = useState('');
  const [clientRefNo, setClientRefNo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [noDeviation, setNoDeviation] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedVendorIndex, setSelectedVendorIndex] = useState(null);
  const [newVendorRows, setNewVendorRows] = useState([]);
  const [priceBasis, setPriceBasis] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [packaging, setPackaging] = useState('');
  const [validity, setValidity] = useState('');
  const [mtc, setMtc] = useState('');
  const [tpi, setTpi] = useState('');
  const [Res1, setRes1] = useState();
  const [Res2, setRes2] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/vendor-name') // Adjust the URL to match your API route
      .then((response) => {
        setVendorList(response.data); // Assuming response.data is an array of vendor names
      })
      .catch((error) => console.error('Error fetching vendors:', error));
  }, []);

  const handleVendorInputChange = (materialIndex, vendorIndex, field, value) => {
    setVendors((prevState) => {
      const updatedVendors = { ...prevState };
      if (field === 'vendor_name') {
        materials.forEach((_, matIndex) => {
          updatedVendors[matIndex] = {
            ...updatedVendors[matIndex],
            [`vendor_${vendorIndex}`]: {
              ...(updatedVendors[matIndex]?.[`vendor_${vendorIndex}`] || {}),
              [field]: value,
            },
          };
        });
      } else {
        updatedVendors[materialIndex] = {
          ...updatedVendors[materialIndex],
          [`vendor_${vendorIndex}`]: {
            ...(updatedVendors[materialIndex]?.[`vendor_${vendorIndex}`] || {}),
            [field]: value,
          },
        };
      }
      return updatedVendors;
    });
  };

  // Add a new row when the "Add New Vendor" button is clicked
  const handleAddNewVendorRow = () => {
    setNewVendorRows((prevRows) => [...prevRows, {}]); // Add a new empty object for the new vendor row
    setVendorCount((prevCount) => prevCount + 1); // Increment vendor count
  };


  const handleAddVendorColumns = () => {
    setVendorCount(vendorCount + 1);
  };

  // Handle vendor selection from the dropdown
  const handleVendorChange = (event) => {
    const selectedVendorNames = event.target.value;
    setSelectedVendors(selectedVendorNames);
  };

  const checkNoDeviation = () => {
    if (!noDeviation) return;

    const updatedMaterials = [...materials];

    updatedMaterials.forEach((material, rowIndex) => {
      let selectedUnitPrice = Infinity;
      let selectedVendor = null;
      const currentVendors = vendors[rowIndex] || {};

      // Get vendor entries with their actual names from the vendor name column
      const vendorEntries = Object.entries(currentVendors).map(([key, vendorData]) => {
        const vendorIndex = parseInt(key.replace('vendor_', ''));
        return {
          ...vendorData,
          actualName: vendorIndex < selectedVendors.length ? selectedVendors[vendorIndex] : vendorData.vendor_name
        };
      });

      // Step 1: Filter vendors with blank deviation
      const noDeviationVendors = vendorEntries.filter(vendor => !vendor.deviation);

      // Step 2: If no-deviation vendors exist, choose the one with the lowest unit price
      if (noDeviationVendors.length > 0) {
        noDeviationVendors.forEach((vendor) => {
          const unitValue = parseFloat(vendor.unit || Infinity);
          if (unitValue < selectedUnitPrice) {
            selectedUnitPrice = unitValue;
            selectedVendor = vendor;
          }
        });
      } else {
        // Step 3: If all vendors have a deviation, choose the one with the lowest unit price
        vendorEntries.forEach((vendor) => {
          const unitValue = parseFloat(vendor.unit || Infinity);
          if (unitValue < selectedUnitPrice) {
            selectedUnitPrice = unitValue;
            selectedVendor = vendor;
          }
        });
      }

      if (selectedVendor) {
        material.unit_price = selectedVendor.unit || '';
        material.total_amount = (parseFloat(material.qty) * parseFloat(selectedVendor.unit)).toString() || '';
        material.final_deviation = selectedVendor.deviation || '';
        material.final_vendor = selectedVendor.actualName || ''; // Use the actual vendor name
      }
    });

    setMaterials(updatedMaterials);
  };

  useEffect(() => {
    checkNoDeviation();
  }, [noDeviation, vendors, materials]);

  const handleCheckboxChange = (event) => {
    setNoDeviation(event.target.checked);
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    const estimationData = {
      rfq_no,
      materials: materials.map(material => ({
        materialCode: material.material_code,
        description: material.description,
        qty: material.qty,
        uom: material.uom,
        unitPrice: material.unit_price,
        totalAmount: material.total_amount,
        finalDeviation: material.final_deviation,
        finalVendor: material.final_vendor,
        status: 'Submitted'
      }))
    };

    console.log('Submitting data:', estimationData); // Debug log

    handleSubmitVendor();
    handleSubmitTerms();
    axios.post('http://localhost:3000/api/estimation', estimationData)
      .then(response => {
        console.log('Success:', response.data);
        alert('Data submitted successfully!');
        if(response.status === 200 && Res1 === 200 && Res2 === 200)
            {navigate('/QuotationHeader');}
        })
      .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data. Please try again.');
      });
  };

  const handleSubmitVendor = async () => {
    const vendorData = [];

    // Iterate through materials
    materials.forEach((material, materialIndex) => {
      // Iterate through selected vendors
      selectedVendors.forEach((vendorName, vendorIndex) => {
        const vendorInfo = vendors[materialIndex]?.[`vendor_${vendorIndex}`] || {};
        const unit = vendorInfo.unit || '';
        const total = material.qty * parseFloat(unit) || 0;

        vendorData.push({
          rfq_no,
          vendorName, // Changed from vendor_name to match backend
          materialCode: material.material_code, // Added material_code
          unit: unit,
          total: total.toString(),
          deviation: vendorInfo.deviation || '',
        });
      });
    });

    try {
      await axios.post('http://localhost:3000/api/vendor', vendorData)
                .then((response)=>{
                 if(response.status === 200){
                  setRes1(200);
                 }
                })
      console.log('Vendor data submitted successfully');
    } catch (error) {
      console.error('Error submitting vendor data:', error);
    }
  };


  const handleSubmitTerms = async () => {
    const termsData = [];

    // Iterate through selected vendors
    selectedVendors.forEach((vendorName, vendorIndex) => {
      const vendorInfo = vendors[0]?.[`vendor_${vendorIndex}`] || {};

      termsData.push({
        rfq_no,
        vendor_name: vendorName, // Use the selected vendor name
        price_basis: vendorInfo.price_basis || '',
        delivery_time: vendorInfo.delivery_time || '',
        payment_terms: vendorInfo.payment_terms || '',
        packaging: vendorInfo.packaging || '',
        validity: vendorInfo.validity || '',
        mtc: vendorInfo.mtc || '',
        tpi: vendorInfo.tpi || '',
      });
    });

    try {
      await axios.post('http://localhost:3000/api/term-condition', termsData)
      .then((response)=>{
        if(response.status === 200){
         setRes2(200);
        }
       })
      console.log('Terms and conditions submitted successfully');
    } catch (error) {
      console.error('Error submitting terms and conditions:', error);
    }
  };


  useEffect(() => {
    if (rfq_no) {
      console.log('Fetching details for Inquiry:', rfq_no);

      axios
        .post('http://localhost:3000/api/inquiry-details', { query: 'SELECT * FROM solitaire WHERE rfq_no = ?', params: [rfq_no] })
        .then((response) => {
          if (response.data.length > 0) {
            const { location, due_date, client_ref_no } = response.data[0];
            setDueDate(due_date);
            setClientRefNo(client_ref_no);
            setLocation(location);
          } else {
            alert('Contact person or client not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching contact details:', error);
          alert('An error occurred while fetching contact details.');
        });
    }
  }, [rfq_no]);

  useEffect(() => {
    if (rfq_no) {
      console.log('Fetching details for Inquiry:', rfq_no);

      axios
        .post('http://localhost:3000/api/estimation-material', { query: 'SELECT * FROM amardeep WHERE rfq_no = ?', params: [rfq_no] })
        .then((response) => {
          if (response.data.length > 0) {
            // Assuming response.data is an array of material objects
            const fetchedMaterials = response.data.map((item) => ({
              material_code: item.material_code,
              description: item.description,
              qty: item.qty,
              uom: item.uom,
            }));

            setMaterials(fetchedMaterials);
          } else {
            alert('No materials found for this RFQ.');
          }
        })
        .catch((error) => {
          console.error('Error fetching material details:', error);
          alert('An error occurred while fetching material details.');
        });
    }
  }, [rfq_no]);

  const handleEstimationSave = (event) => {
    event.preventDefault();

    const estimationDataSaved = {
      rfq_no,
      materials: materials.map(material => ({
        materialCode: material.material_code,
        description: material.description,
        qty: material.qty,
        uom: material.uom,
        unitPrice: material.unit_price,
        totalAmount: material.total_amount,
        finalDeviation: material.final_deviation,
        finalVendor: material.final_vendor,
        status: 'Saved'
      }))
    };

    console.log('Submitting data:', estimationDataSaved); // Debug log

    axios.post('http://localhost:3000/api/estimation-saved', estimationDataSaved)
      .then(response => {
        console.log('Success:', response.data);
        alert('Data Saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error saved data. Please try again.');
      });
    handleSavedVendor();
    handleSavedTerms();
  };

  const handleSavedVendor = async () => {
    const vendorDataSaved = [];

    // Iterate through materials
    materials.forEach((material, materialIndex) => {
      // Iterate through selected vendors
      selectedVendors.forEach((vendorName, vendorIndex) => {
        const vendorInfo = vendors[materialIndex]?.[`vendor_${vendorIndex}`] || {};
        const unit = vendorInfo.unit || '';
        const total = material.qty * parseFloat(unit) || 0;

        vendorDataSaved.push({
          rfq_no,
          vendorName, // Changed from vendor_name to match backend
          materialCode: material.material_code, // Added material_code
          unit: unit,
          total: total.toString(),
          deviation: vendorInfo.deviation || '',
          flag: 'Saved',
        });
      });
    });

    try {
      await axios.post('http://localhost:3000/api/vendor-saved', vendorDataSaved);
      console.log('Vendor data saved successfully');
    } catch (error) {
      console.error('Error saved vendor data:', error);
    }
  };


  const handleSavedTerms = async () => {
    const termsDataSaved = [];

    // Iterate through selected vendors
    selectedVendors.forEach((vendorName, vendorIndex) => {
      const vendorInfo = vendors[0]?.[`vendor_${vendorIndex}`] || {};

      termsDataSaved.push({
        rfq_no,
        vendor_name: vendorName, // Use the selected vendor name
        price_basis: vendorInfo.price_basis || '',
        delivery_time: vendorInfo.delivery_time || '',
        payment_terms: vendorInfo.payment_terms || '',
        packaging: vendorInfo.packaging || '',
        validity: vendorInfo.validity || '',
        mtc: vendorInfo.mtc || '',
        tpi: vendorInfo.tpi || '',
        status: 'Saved',
      });
    });

    try {
      await axios.post('http://localhost:3000/api/term-condition-saved', termsDataSaved);
      console.log('Terms and conditions saved successfully');
    } catch (error) {
      console.error('Error saved terms and conditions:', error);
    }
  };

  /// estimation Saved Part here 
  const [EstimationDataSaved, setEstimationDataSaved] = useState([]);
  // const [TermConditionData, setTermsConditions] = useState([]);
  const [VendorDataSaved, setVendorDataSaved] = useState([]);
  const defaultValues = VendorDataSaved.map((vendor) => vendor.vname);
  const [TermConditionDataSaved, setTermsConditionsSaved] = useState([]);

  // const fetchEstimationDataSaved = () => {
  //   axios.get(`http://localhost:3000/api/estimation-data-saved`, { params: { rfq_no } })
  //     .then(response => setEstimationDataSaved(response.data),
  //     )
  //     .catch(error => console.error('Fetch error:', error));
  // };

  // const fetchVendorDataSaved = () => {
  //   axios.get(`http://localhost:3000/api/estimation-vendor-saved`, { params: { rfq_no } })
  //     .then(response => setVendorDataSaved(response.data),
  //     )
  //     .catch(error => console.error('Fetch error:', error));
  // };

  // const fetchTermsConditionData = () => {
  //   axios.get(`http://localhost:3000/api/estimation-terms-condition-saved`, { params: { rfq_no } })
  //     .then(response =>
  //       setTermsConditionsSaved(response.data)
  //     )
  //     .catch(error => console.error('Fetch error:', error));
  // };

  // useEffect(() => {
  //   fetchEstimationDataSaved();
  // }, []);

  // useEffect(() => {
  //   fetchVendorDataSaved();
  // }, []);


  // useEffect(() => {
  //   fetchTermsConditionData();
  // }, []);


  const fetchEstimationDataSaved = () => {
    axios
      .get(`http://localhost:3000/api/estimation-data-saved`, { params: { rfq_no } })
      .then((response) => setEstimationDataSaved(response.data))
      .catch((error) => console.error("Fetch error:", error));
  };

  // Fetch vendor data
  const fetchVendorDataSaved = () => {
    axios
      .get(`http://localhost:3000/api/estimation-vendor-saved`, { params: { rfq_no } })
      .then((response) => {
        setVendorDataSaved(response.data);
        const savedVendors = response.data.map((vendor) => vendor.vname);
        setSelectedVendors(savedVendors); // Set default selected vendors
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  // Fetch terms and conditions
  const fetchTermsConditionData = () => {
    axios
      .get(`http://localhost:3000/api/estimation-terms-condition-saved`, { params: { rfq_no } })
      .then((response) => setTermsConditionsSaved(response.data))
      .catch((error) => console.error("Fetch error:", error));
  };

  // Fetch all data on load
  useEffect(() => {
    if (rfq_no) {
      fetchEstimationDataSaved();
      fetchVendorDataSaved();
      fetchTermsConditionData();
    }
  }, [rfq_no]);


  console.log(VendorDataSaved);

  return (
    <Box component="form" onSubmit={handleSubmit} className={classes.formContainer}>
      <Box style={{ padding: '20px', marginTop: '20px', marginLeft: '20pc', width: '50%', position: 'flex', border: '1px solid gray' }}>
        <Typography variant="h5" gutterBottom>Solitaire Estimation</Typography>
        <TextField
          label="RFQ No."
          value={rfq_no}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
          className={classes.textField}
        />
        <TextField
          label="Client Ref No"
          value={clientRefNo}
          onChange={(e) => setClientRefNo(e.target.value)}
          fullWidth
          InputProps={{ readOnly: true }}
          margin="normal"
          className={classes.textField}
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          InputProps={{ readOnly: true }}
          margin="normal"
          className={classes.textField}
        />
        <TextField
          label="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          InputProps={{ readOnly: true }}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          className={classes.textField}
        />


        {/* <Autocomplete
          fullWidth
          style={{ marginBottom: '20px' }}
          multiple
          options={vendorList.map((vendor) => vendor.vendor_name)} // Ensure vendorList is populated
          value={selectedVendors} // Dynamically set this based on fetched data
          onChange={(event, newValue) => setSelectedVendors(newValue)} // Update selected vendors
          renderInput={(params) => <TextField {...params} label="Select Vendor(s)" />}
          isOptionEqualToValue={(option, value) => option === value} // Ensures correct matching of selected values
        /> */}


        {/* <Autocomplete
          fullWidth
          style={{ marginBottom: "20px" }}
          multiple
          options={vendorList.map((vendor) => vendor.vendor_name)} // Ensure vendorList is populated
          value={selectedVendors} // Dynamically set this based on fetched data
          onChange={(event, newValue) => setSelectedVendors(newValue)} // Update selected vendors
          renderInput={(params) => <TextField {...params} label="Select Vendor(s)" />}
          isOptionEqualToValue={(option, value) => option === value} // Ensures correct matching of selected values
        /> */}

        {/* <Autocomplete
          fullWidth
          style={{ marginBottom: "20px" }}
          multiple
          options={vendorList
            .map((vendor) => vendor.vendor_name)
            .filter((name) => !selectedVendors.includes(name))} // Exclude already selected names
          value={selectedVendors}
          onChange={(event, newValue) => {
            const removedVendors = selectedVendors.filter((v) => !newValue.includes(v));
            removedVendors.forEach((vendor) => {
              // Send a DELETE request for each removed vendor
              axios
                .delete(`http://localhost:3000/api/remove-vendor`, { data: { rfq_no, vendor_name: vendor } })
                .then(() => console.log(`Vendor ${vendor} deleted`))
                .catch((error) => console.error("Error deleting vendor:", error));
            });

            setSelectedVendors(newValue); // Update selected vendors
          }}
          renderInput={(params) => <TextField {...params} label="Select Vendor(s)" />}
          isOptionEqualToValue={(option, value) => option === value}
        /> */}

        <Autocomplete
          fullWidth
          style={{ marginBottom: "20px" }}
          multiple
          options={vendorList
            .map((vendor) => vendor.vendor_name)
            .filter((name, index, self) => self.indexOf(name) === index && !selectedVendors.includes(name))} // Remove duplicates and exclude selected vendors
          value={Array.from(new Set(selectedVendors))} // Ensure selected values are unique
          onChange={(event, newValue) => {
            const uniqueNewValue = Array.from(new Set(newValue)); // Remove duplicates from newValue
            const removedVendors = selectedVendors.filter((v) => !uniqueNewValue.includes(v));

            removedVendors.forEach((vendor) => {
              // Send a DELETE request for each removed vendor
              axios
                .delete(`http://localhost:3000/api/remove-vendor`, { data: { rfq_no, vendor_name: vendor } })
                .then(() => console.log(`Vendor ${vendor} deleted`))
                .catch((error) => console.error("Error deleting vendor:", error));
            });

            setSelectedVendors(uniqueNewValue); // Update selected vendors without duplicates
          }}
          renderInput={(params) => <TextField {...params} label="Select Vendor(s)" />}
          isOptionEqualToValue={(option, value) => option === value}
        />



        {/* <Autocomplete
          fullWidth
          style={{ marginBottom: '20px' }}
          multiple
          options={vendorList.map((vendor) => vendor.vendor_name)}
          value={selectedVendors}
          defaultValue={defaultValues}
          onChange={(event, newValue) => setSelectedVendors(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Vendor(s)" />}
        /> */}

        <br />

        <FormControlLabel
          control={
            <Checkbox
              checked={noDeviation}
              onChange={handleCheckboxChange}
            />
          }
          label="Select Vendor With no Deviation"
        />
        <br />

      </Box>


      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleAddNewVendorRow} className={classes.button}>
          Add New Vendor
        </Button>
      </Box>
      <br /> */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>MATERIAL CODE</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>SR No</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>DESCRIPTION</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>QTY</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>UOM</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>UNIT PRICE</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>Total AMOUNT</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>Final Deviation</TableCell>
              <TableCell className={classes.tableHeaderCell} rowSpan={2}>Final Vendor</TableCell>

              {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, i) => (
                <TableCell key={i} colSpan={4} className={classes.vendorHeader}>
                  {i < selectedVendors.length ? "Vendor (Selected)" : `New Vendor ${i - selectedVendors.length + 1}`}
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    value={i < selectedVendors.length ? selectedVendors[i] || '' : vendors[0]?.[`vendor_${i}`]?.vendor_name || ''}
                    // disabled={i < selectedVendors.length} // Disable if it's from the dropdown
                    onChange={(e) => handleVendorInputChange(0, i, 'vendor_name', e.target.value)} // Manually add new vendor names
                  />
                </TableCell>
              ))}
            </TableRow>
            <TableRow>

              {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, i) => (
                <React.Fragment key={i}>
                  <TableCell className={classes.tableHeaderCell}>Vendor Name</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Unit</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Total</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Deviation</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {materials.map((material, materialIndex) => (
              <TableRow key={materialIndex}>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.material_code} fullWidth disabled />
                </TableCell>
                <TableCell className={classes.tableCell}>{materialIndex + 1}</TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.description} fullWidth disabled />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.qty} fullWidth disabled />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.uom} fullWidth disabled />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField
                    value={material.unit_price || 0}
                    onChange={(e) => {
                      const updatedMaterials = [...materials];
                      updatedMaterials[materialIndex].unit_price = e.target.value;
                      setMaterials(updatedMaterials);
                    }}
                    fullWidth
                  />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.qty * material.unit_price || ''} fullWidth disabled />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.final_deviation} fullWidth disabled />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField value={material.final_vendor} fullWidth disabled />
                </TableCell>
                {/* {VendorDataSaved.length > 0 ? (
                  <>
                    {VendorDataSaved.map((vendor) => {
                      <>
                        {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, vendorIndex) => (
                          <React.Fragment key={vendorIndex}>
                            <TableCell className={classes.tableCell}>
                              <TextField
                                value={VendorDataSaved.length > 0 ? vendor.vname ||
                                  vendorIndex < selectedVendors.length
                                  ? selectedVendors[vendorIndex] || '' // For selected vendor from dropdown
                                  : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.vendor_name || '' : vendorIndex < selectedVendors.length
                                  ? selectedVendors[vendorIndex] || '' // For selected vendor from dropdown
                                  : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.vendor_name || ''
                                }
                                onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'vendor_name', e.target.value)}
                                fullWidth
                              // disabled={vendorIndex < selectedVendors.length} // Disable input for dropdown-selected vendors
                              />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <TextField
                                value={VendorDataSaved.length > 0 ? vendor.vunit || vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
                                onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'unit', e.target.value)}
                                fullWidth
                              />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <TextField
                                value={material.qty * vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
                                fullWidth
                              />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <TextField
                                value={VendorDataSaved.length > 0 ? vendor.deviation || vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.deviation : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.deviation || ''}
                                onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'deviation', e.target.value)}
                                fullWidth
                              />
                            </TableCell>
                          </React.Fragment>
                        ))}
                      </>
                    })}
                  </>
                ) : (
                  <>
                    {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, vendorIndex) => (
                      <React.Fragment key={vendorIndex}>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={
                              vendorIndex < selectedVendors.length
                                ? selectedVendors[vendorIndex] || '' // For selected vendor from dropdown
                                : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.vendor_name || '' // For manually typed vendors
                            }
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'vendor_name', e.target.value)}
                            fullWidth
                          // disabled={vendorIndex < selectedVendors.length} // Disable input for dropdown-selected vendors
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'unit', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={material.qty * vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.deviation || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'deviation', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </>
                )} */}

                {Array.from({ length: selectedVendors.length + newVendorRows.length }).map((_, vendorIndex) => (
                  <React.Fragment key={vendorIndex}>
                    {VendorDataSaved.length > 0 && vendorIndex < VendorDataSaved.length ? (
                      <React.Fragment>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={VendorDataSaved[vendorIndex]?.vname || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'vendor_name', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={VendorDataSaved[vendorIndex]?.vunit || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'unit', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={material.qty * (VendorDataSaved[vendorIndex]?.vunit || 0)}
                            fullWidth
                            disabled
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={VendorDataSaved[vendorIndex]?.deviation || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'deviation', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={
                              vendorIndex < selectedVendors.length
                                ? selectedVendors[vendorIndex] || ''
                                : vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.vendor_name || ''
                            }
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'vendor_name', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'unit', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={material.qty * (vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.unit || 0)}
                            fullWidth
                            disabled
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            value={vendors[materialIndex]?.[`vendor_${vendorIndex}`]?.deviation || ''}
                            onChange={(e) => handleVendorInputChange(materialIndex, vendorIndex, 'deviation', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))}


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Terms and Conditions sections */}
      {TermConditionDataSaved.length > 0 ? (
        <Box className={classes.termsContainer}>
          <>
            {/* Display for selected vendors */}
            {selectedVendors.map((vendor, index) => (
              <Box key={index} className={classes.termsBox}>
                <Typography variant="h6">Terms and Conditions ({vendor})</Typography>
                <TextField
                  label="Price Basis"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.price_basis || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'price_basis', e.target.value)}
                />
                <TextField
                  label="Delivery Time"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.delivery_time || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'delivery_time', e.target.value)} // Update delivery time state
                />
                <TextField
                  label="Payment Terms"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.payment_terms || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'payment_terms', e.target.value)} // Update payment terms state
                />
                <TextField
                  label="Packaging"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.packaging || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'packaging', e.target.value)} // Update packaging state
                />
                <TextField
                  label="Validity"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.validity || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'validity', e.target.value)} // Update validity state
                />
                <TextField
                  label="MTC"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.mtc || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'mtc', e.target.value)} // Update MTC state 
                />
                <TextField
                  label="TPI"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.tpi || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'tpi', e.target.value)} // Update TPI state
                />
              </Box>
            ))}
          </>
        </Box>
      ) : (
        <Box className={classes.termsContainer}>
          {/* Display for selected vendors */}
          <>
            {selectedVendors.map((vendor, index) => (
              <Box key={index} className={classes.termsBox}>
                <Typography variant="h6">Terms and Conditions ({vendor})</Typography>
                <TextField
                  label="Price Basis"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.price_basis || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'price_basis', e.target.value)}
                />
                <TextField
                  label="Delivery Time"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.delivery_time || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'delivery_time', e.target.value)} // Update delivery time state
                />
                <TextField
                  label="Payment Terms"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.payment_terms || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'payment_terms', e.target.value)} // Update payment terms state
                />
                <TextField
                  label="Packaging"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.packaging || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'packaging', e.target.value)} // Update packaging state
                />
                <TextField
                  label="Validity"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.validity || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'validity', e.target.value)} // Update validity state
                />
                <TextField
                  label="MTC"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.mtc || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'mtc', e.target.value)} // Update MTC state 
                />
                <TextField
                  label="TPI"
                  fullWidth
                  margin="normal"
                  value={vendors[0]?.[`vendor_${index}`]?.tpi || ''}
                  onChange={(e) => handleVendorInputChange(0, index, 'tpi', e.target.value)} // Update TPI state
                />
              </Box>
            ))}
          </>
        </Box>
      )}
      <Button onClick={handleEstimationSave} variant="contained" color="primary" className={classes.button} style={{ marginTop: '10px' }}>Save</Button>
      <Button onclick={handleSubmit} href={'QuotationHeader'} type="submit" variant="contained" color="primary" className={classes.button} style={{ marginTop: '10px', marginLeft: '10px' }}>Submit</Button>

    </Box>
  );
};

export default EstimationForm; 
