import {v7 as uuidv7} from 'uuid';
import Trend from 'react-trend';
import React, { DOMElement, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './article_list.scss'
import storeMenu from '../../../stores'
import FormTemplate, { FinalSessionType, FormTemplate_MultiSelectType, FormTemplateInDataChangeType, FormTemplateType, PropConfigConfirmDialog, PropConfigConfirmDialogResponse, PropConfigType } from '../../../components/atoms/FormTemplate'
import { Button as ButtonPrime } from 'primereact/button';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import FormTemplateContextProv, { FormTemplateContext, FormTemplateContextInterface } from '../../../components/atoms/FormTemplate/FormTemplateContext';
// import { Button, Form } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MaterialReactTable, MRT_ColumnDef, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { Box, Button, Chip } from '@mui/material';
import { ConstructionOutlined, ControlPointRounded, DeleteForever, ModeEdit, Refresh } from '@mui/icons-material';
import { getValueFromLocalStorageFunc, handleSwal, PPE_getApiSync, URL_API_PPE } from '../../../services/functions';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastContainer } from 'react-toastify';
import { Tag } from 'primereact/tag';
import format from 'date-fns/format';


const ArticleList = () => {

  const [ uuidRowSelected, setUUIDRowSelected ] = useState<string>(''); // row id per baris selected
  const [rowList, setRowList] = useState<any[]>([]);
  const [statusSelected, setStatusSelected] = useState<string>('');

  const [showProgressBars, setShowProgressBars] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showForm, setShowForm] = useState<boolean>(false); // tampilkan form tambah edit
  const [statusInput, setStatusInput] = useState<'edit'|'new'>('new'); // tampilkan form tambah edit

  const toastProsesRef = useRef<any>();

  const prop_config_ref = useRef<FormTemplateType[]>([]);
  const final_session_ref = useRef<FinalSessionType>();
  // const [propConfig, setPropConfig] = useState<{FormTemplateType[]>([]);
  const [propConfig, setPropConfig] = useState<PropConfigType>({type:'Form', config:[]});
  const [finalSession, setFinalSession] = useState<FinalSessionType|null>(null);
  const [statusDone, setStatusDone] = useState<boolean>(false);
  const [arrDataEdit, setArrDataEdit] = useState<any>({});  // data edit
  const [inDataChangeState, setInDataChangeState] = useState<FormTemplateInDataChangeType>({set:[]});
  const [inConfirmDialog, setInConfirmDialog] = useState<PropConfigConfirmDialogResponse>({confirm: null}); // berikan jawaban respon ke form template yes / no (delete image or else)

  const {contextActionClick, setContextShowModal} = useContext<FormTemplateContextInterface>(FormTemplateContext);

  useEffect(()=>{

    const arrGender:FormTemplate_MultiSelectType[] = [{id:'Male',name:'Male'},{id:'Female',name:'Female'}]

    prop_config_ref.current = [
                                { section_id:'id_section1'
                                  , section_name:'name_section1'
                                  , class_add:'d-flex justify-content-center'
                                  , props:{
                                      header:{
                                        show:true,
                                        title:'Information',
                                        icon:<IconField className='pi pi-info-circle' style={{color:'#FF9F43'}} />
                                      } 
                                  }
                                  // , show_border: false
                                  , data_column:[
                                        {
                                          to:12,
                                          breakpoint:{
                                            to_sm:12,
                                            to_md:6
                                          },
                                          data_input:
                                          [
                                            {
                                              type:'text',
                                              id:'id_title',
                                              disabled: false,
                                              label:'Title',
                                              name:'name_title',
                                              placeholder:'Input Title',
                                              required:true,
                                              style:{
                                                // background_color:'cornsilk',
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile: false // nonaktif inputgroup ukuran mobile
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'title'
                                              },
                                              save:{
                                                key_name:'title'
                                              }
                                            },
                                            {
                                              type:'text',
                                              id:'id_description',
                                              disabled: false,
                                              label:'Description',
                                              name:'name_description',
                                              placeholder:'Input Description',
                                              required:true,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'description'
                                              },
                                              save:{
                                                key_name:'description'
                                              }
                                            }
                                            ,{
                                              type:'text',
                                              id:'id_url_photo',
                                              disabled: false,
                                              label:'URL Photo',
                                              name:'name_url_photo',
                                              placeholder:'https://',
                                              required:false,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'url_photo'
                                              },
                                              save:{
                                                key_name:'url_photo'
                                              }
                                            }
                                            ,{
                                              type:'multi-select',
                                              id:'id_kategori',
                                              name:'name_kategori',
                                              label:'Kategori',
                                              placeholder:'Select a Kategori',
                                              select_item_type:'single',
                                              required:true,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              // on_change:{
                                              //   parse_value_to:{multi_select_name:['name_berita']}
                                              // },
                                              data_source:{
                                                type:'hardcode',
                                                data:[
                                                  {id:'Ekonomi', name:'Ekonomi'},
                                                  {id:'Olahraga', name:'Olahraga'},
                                                  {id:'Teknologi', name:'Teknologi'},
                                                ]
                                                
                                              },
                                              edit:{
                                                key_name:'kategori',
                                                key_value:'kategori'
                                              },
                                              save:{
                                                key_name:'kategori'
                                              }
                                            }
                                            
                                            ,{
                                              type:'chips',
                                              class:'mt-0',
                                              id:'id_tags',
                                              name:'name_tags',
                                              label:'Tags',
                                              placeholder:'Input Tags',
                                              required: false,
                                              edit:{
                                                key_name:'tags',
                                                split_string:','
                                              },
                                              save:{
                                                key_name:'tags',
                                                format:{
                                                  type:'array'
                                                }
                                              }
                                            }
                                          ]
                                        }
                                        ,{
                                          to:12,
                                          breakpoint:{
                                            to_sm:12,
                                            to_md:6
                                          },
                                          data_input:
                                          [
                                            {
                                              type:'date',
                                              id:'id_tanggal',
                                              label:'Tanggal',
                                              name:'name_tanggal',
                                              placeholder:'Input Tanggal',
                                              required:true,
                                              disabled_days:{
                                                sunday: false,
                                                saturday: false
                                              },
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              save:{
                                                key_name:'tanggal',
                                                format:'yyyy-MM-dd'
                                              },
                                              edit:{
                                                key_name:'tanggal',
                                                format:'yyyy-MM-dd'
                                              },
                                              show:{
                                                format:'dd MMMM yyyy',
                                                month_year_picker:false
                                              }
                                            }
                                            ,{
                                              type:'editor',
                                              id:'id_content',
                                              name:'name_content',
                                              label:'Content',
                                              placeholder:'Input Content',
                                              save:{
                                                key_name:'content'
                                              },
                                              edit:{
                                                key_name:'content'
                                              }
                                            }
                                            
                                          ]
                                        }
                                        
                                      ]
                                }];

    
    setPropConfig({type:'Form', config: [...prop_config_ref.current]});

    final_session_ref.current = {
      ...final_session_ref.current,
      button:{
        cancel:{
          enabled: true,
          show: true
        },
        save:{
          enabled: true,
          show: true
        }
      }
    };

    setFinalSession({...final_session_ref.current});

    // setArrDataEdit({
    //     'nomor_faktur':'J-20241112-123-A879',
    //     'edit_telepon': '0561-12345678',
    //     'tanggal': '2024-12-01',
    //     'keterangan': 'Kirim ke sanggau',

    //     'topic_id':'antara',   // config : edit -> key_name
    //     'topic_name':'antara', // config : edit -> key_value

    //     'kategori_id':'terbaru',  // bisa berupa array ['terbaru','antara'], id dan name pada array harus sama jumlah item nya
    //     'kategori_name':'terbaru',  // key-value di pasangkan berdasarkan urutan index nya, contoh: id:['terbaru_id'], name:['terbaru_name']

    //     'berita_id':"Menteri ATR/BPN bersinergi dengan BUMN wujudkan swasembada energi",
    //     'berita_name':"Menteri ATR/BPN bersinergi dengan BUMN wujudkan swasembada energi",

    //     'active': true,
    //     'umur':198.23,

    //     // 'password':34535,
    //     'gender': 'Male'  // jika tipe nya single, maka string 'male'. jika multiple, maka array ['male','female']

    //     ,'email':'gunardihalim@gmail.com'
    //     // ,'tags':'abc, good,hello'
    //     ,'tags': 'Good,Better'
    //     ,'photo':{id:'id-gambar-1', name:'Modern-Technology.jpg', size:'199', type:'image/jpg', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
    //     ,'product':[
    //       // size di sini harus dalam bentuk bytes semua
    //       // * File yang multiple harus satu pilihan antara Document atau Image
          
    //               {id:'id-file-1', name:'Modern-Technology.docx', size:'200.578', type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
    //               ,{id:'id-file-2', name:'data_sales.doc', size:'500', type:'application/msword', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
    //               ,{id:'id-file-3', name:'data_customer_list.xls', size:'150', type:'application/vnd.ms-excel', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
    //               ,{id:'id-gambar-1', name:'Modern-Technology.jpg', size:'199', type:'image/jpg', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
    //           ]

    //     // *** Detail Table 
    //     , 'edit_detail_transaksi':[
    //             {kode_produk:'shell',  image_product:'https://wallpapers.com/images/hd/shell-logo-red-yellow-ylhb2f0hphp6ey09-ylhb2f0hphp6ey09.png', nama_produk:'Shell', code:'SHL', '1h':0.12, '1h_trend':'naik',  harga:125000, data_trend:randomNumberArray(30), status:'Failed'}
    //             ,{kode_produk:'pepsi', image_product:'https://awsimages.detik.net.id/community/media/visual/2019/11/22/5046d875-0493-4a5e-9057-0d402c1d841e.jpeg?w=600&q=90', nama_produk:'Pepsi', code:'PSI', '1h':'5.00', '1h_trend':'turun', data_trend:randomNumberArray(50), harga:500500.19, status:'Completed'}
    //             ,{kode_produk:'dior', image_product:'https(broken tes)://i.pinimg.com/736x/e0/08/c7/e008c74ffb23fdfcdf3ffdf39ba44b9b.jpg', nama_produk:'Dior', code:'DIR', '1h':10.58, '1h_trend':'turun', harga:75000, data_trend:randomNumberArray(50), status:'Process'}
    //             ,{kode_produk:'coca-cola', image_product:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4bYOCRGoYXnHFtxxvhouF4dffr6IbIFkyzg&s', nama_produk:'Coca Cola', code:'CCL',  '1h':97.23, '1h_trend':'naik', harga:15750, data_trend:randomNumberArray(50), status:'Other'}
    //       ]

    //     , 'content':'Halo Dunia'
    // })

    // setTimeout(()=>{
    //   setStatusDone(true);
    // },100)

  },[])


  useEffect(()=>{
    setTimeout(()=>{
      // dispatch icon title
      storeMenu.dispatch({type:'titleicon', text: 'Article'})

      // dispatch breadcrumb path
      storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Article', value:'Article'}, {key:'List', value:'List'}]})
      
    },100)
  },[])


  const outChange = (obj, formData:FormData|null) => {

    // // * Tes Reducer
    // dispatchredus({type:'a'})

    // console.clear();
    console.log("Out Change");
    console.log(obj);

    if (formData !== null){
      console.log("Form Data");
      // console.log(formData)
      formData.forEach((value, key)=>{
        console.log(key);
        if (typeof value === 'string'){
          // console.log(JSON.stringify(JSON.parse(value),null,2));
        }
        else {
          // console.log(value)
        }
      })
    }

    // if (
    //   obj?.['status_proses'] === 'process_out_change' && 
    //     obj?.['posisi_name_input_when_onchange'] != null
    // ) {
    //     // isi kembali perubahan data ke form template karena kondisi tertentu

    //     let tempInDataChange:FormTemplateInDataChangeType = {set:[]};
    //     if (  
    //           // posisi input sedang di name_telepon
    //           obj?.['posisi_name_input_when_onchange'] === 'name_telepon' &&
    //           obj?.['data']?.['telepon']) {
    
    //           let prosesToSetState:boolean = false;
    //           if (obj?.['data']?.['telepon'] === '123') {

    //             tempInDataChange = {
    //                 set:[
    //                       {type:'value_input', data:[{name:'name_customer', value:'CUSTOMER IN data Change'}]},
    //                       {type:'value_input', data:[{name:'name_umur', value:9700.98}]},
    //                       {type:'date_input', data:[{name:'name_tanggal', value: new Date(2024,0,1)},
    //                                           {name:'name_tanggal_check', value: null}
    //                                           // {name:'name_tanggal_check', value: new Date(2024,1,1)}
    //                       ]}
    //                       ,{type:'multiselect_input', data:[{name:'name_gender', value:['Male']}]}  // perhatikan yang single atau multi input
    //                     ]
    //             }
    //             prosesToSetState = true;
    //           }
      
    //           if (prosesToSetState){
    //             setInDataChangeState({...tempInDataChange});
    //           }
            
    //     }
    // }

  }

  const outConfirmDialogHandle:PropConfigConfirmDialog = (objElement, formData) => {

    if (objElement && objElement?.['index'] !== -1) {

      if (typeof objElement?.['type'] !== 'undefined') {
        if (objElement?.['type'] === 'Delete File') {
          
          // ** Kondisi Jika Klik Yes (Delete)

          if (objElement?.['obj_input']?.['name'] === 'name_photo'){  // posisi input
            setInConfirmDialog({confirm:true})
          }
          else if (objElement?.['obj_input']?.['name'] === 'name_file_product'){
            setInConfirmDialog({confirm:true})
          }

          // console.log(JSON.stringify(objElement, null, 2))
      
          // formData.forEach((value, key)=>{
          //   console.log(`Value ${key} : ${value}`)
          // })

        }
      }
    }

  }


  let sampleRef = useRef<any>(null);
  

  // useEffect(()=>{
  //   console.log(process.env.REACT_APP_HTTPS);
  //   console.log(process.env.REACT_APP_SSL_CRT_FILE);
  //   console.log(process.env.REACT_APP_SSL_KEY_FILE);
  // },[])

  const fetchApiData = () => {
    // jika pakai promise, di sini tidak perlu pakai async await lagi
    return new Promise((resolve, reject)=>{
      fetch('https://api-berita-indonesia.vercel.app/')
                        .then((response)=>response.json())
                        .then((data)=>resolve(data))
                        .catch(error=>reject(error))
    })
    
      // .then((data)=>{return data})

  }
  
  const randomNumberArray = (repeat:number) => {
    let numbers:number[] = [];
    for(let i=0;i < repeat; i++){
      numbers.push(Math.random() * 100);
    }
    return numbers;
  }

  const backToList = () => {
      // * fungsi keluar dari form dan balik ke list
      setStatusInput('new');
      
      setStatusDone(false);
      setShowForm(false);
    
      setShowProgressBars(true);
      setShowSkeleton(true);
    
      setTimeout(()=>{
        setShowProgressBars(false);
        setShowSkeleton(false);
    
        setArrDataEdit({});
        
      },100)

  }

  const outBackTo = ({status}) => {
      if (status){
          backToList();
      }
  }

  const outCancel = (props) => {
    if (props?.status){
        backToList();
    }
  }

  const outSaveTo = (props) => {

    if (statusInput !== 'new' && statusInput !== 'edit')
    {
      return;
    }

    console.log(uuidRowSelected)
    console.log(props)

    const title = props?.['objSaveData']?.['title'] ?? '';
    const refDataEdit = props?.['objEditData'];

    if (statusInput === 'edit'){
      const getData = localStorage.getItem('data');
      if (getData !== null)
      {
          try {
            const data_arr = JSON.parse(getData);
    
            if (Array.isArray(data_arr) && data_arr.length > 0)
            {
                console.log("data_arr")
                console.log(data_arr)
                let findIndex = data_arr.findIndex((obj, idx)=>obj?.['uuid'] === uuidRowSelected);
                if (findIndex !== -1){
                    // console.log("findItem")
                    // console.log(findIndex)
                    
                    handleSwal('Create' 
                          , title.length >= 37 ? title.slice(0,37) + ' ...' : title
                          , (resultSwal:SweetAlertResult) => {
                      
                          if (resultSwal.isConfirmed)
                          {
                              data_arr.splice(findIndex, 1, refDataEdit);
  
                              localStorage.setItem('data', JSON.stringify([...data_arr]));
  
                              setRowList([...data_arr]);
                              
                              setTimeout(()=>{
                                Swal.fire('Success !', 
                                      `<div>` + 
                                          // `<div style="font-style:italic; font-size:18px; color:cadetblue">"`+ item +`"</div>` + 
                                          `<div>Your file has been Updated.</div>` + 
                                          // `<div>${response?.['message']}</div>` + 
                                      `</div>`
                                      ,'success').then((resultDelete)=>{
                  
                                          // if (resultDelete.isConfirmed){
  
                                            setTimeout(()=>{
                                              backToList();
                                            },100)
                                          // }
                                          
                                      });
                              }, 100)
                          }
                    })
                }
            }
          }catch(e){}
      }
    }
    else if (statusInput === 'new'){

        const getData = localStorage.getItem('data');
        if (getData === null) {
          localStorage.setItem('data', JSON.stringify([]))
        }

        const getDataFinal:any = localStorage.getItem('data');

        handleSwal('Create' 
            , title.length >= 37 ? title.slice(0,37) + ' ...' : title
            , (resultSwal:SweetAlertResult) => {
        
            if (resultSwal.isConfirmed)
            {
                let data_arr = JSON.parse(getDataFinal);
                data_arr = [...data_arr, {...refDataEdit, 'uuid': uuidv7()}];                

                localStorage.setItem('data', JSON.stringify([...data_arr]));

                setRowList([...data_arr]);
                
                setTimeout(()=>{
                  Swal.fire('Success !', 
                        `<div>` + 
                            // `<div style="font-style:italic; font-size:18px; color:cadetblue">"`+ item +`"</div>` + 
                            `<div>Your file has been Created.</div>` + 
                            // `<div>${response?.['message']}</div>` + 
                        `</div>`
                        ,'success').then((resultDelete)=>{
    
                            // if (resultDelete.isConfirmed){

                              setTimeout(()=>{
                                backToList();
                              },100)
                            // }
                            
                        });
                }, 100)
            }
      })
    }


    
  }

  const toolbarButtonClick = (status:'Create'|'Edit'|'Delete', title, row?) => {
  
      setStatusSelected(status);

      if (status == 'Delete'){

          const uuid_selected = row.original?.['uuid'];

          if (typeof uuid_selected !== 'undefined' && uuid_selected !== '')
          {
            setUUIDRowSelected(uuid_selected);
          }
          else {
            setUUIDRowSelected('');
          }

          const getData = localStorage.getItem('data');
          if (getData !== null)
          {
              try {
                const data_arr = JSON.parse(getData);

                let findIndex = data_arr.findIndex((obj, idx)=>obj?.['uuid'] === uuid_selected);
                if (findIndex !== -1)
                {
                    handleSwal('Delete'
                              , row.original?.['title'].length >= 37 ? row.original?.['title'].slice(0,37) + ' ...' : row.original?.['title']
                              , (resultSwal:SweetAlertResult)=>{
                        if (resultSwal.isConfirmed){
                      
                            data_arr.splice(findIndex, 1);

                            localStorage.setItem('data', JSON.stringify([...data_arr]));

                            
                            setTimeout(()=>{
                              Swal.fire('Success !', 
                                    `<div>` + 
                                        // `<div style="font-style:italic; font-size:18px; color:cadetblue">"`+ item +`"</div>` + 
                                        `<div>Your file has been Deleted.</div>` + 
                                        // `<div>${response?.['message']}</div>` + 
                                    `</div>`
                                    ,'success').then((resultDelete)=>{
                
                                        // if (resultDelete.isConfirmed){
                                          setRowList([...data_arr]);

                                          setTimeout(()=>{
                                            backToList();
                                          },100)
                                        // }
                                        
                                    });
                            }, 100)
                        } 
                        else if (resultSwal.dismiss == Swal.DismissReason.cancel){
                            // handleSwalResult('cancelled');
                        }
                    })

                }
              }catch(e){}
          }
  
      }
      else if (status === 'Edit'){

          // console.log("ROW EDIT");
          // console.log(row.original);
          if (typeof row.original?.['uuid'] !== 'undefined' && row.original?.['uuid'] !== '')
          {
            setUUIDRowSelected(row.original?.['uuid']);
          }
          else {
            setUUIDRowSelected('');
          }

          setStatusInput('edit');
          
          setTimeout(()=>{
            setArrDataEdit({...row.original});
            setStatusDone(true);
            setShowForm(true);
          },100)
          
      }
      else if (status === 'Create'){
        setStatusInput('new');
          
        setTimeout(()=>{
          setStatusDone(true);
          setShowForm(true);
        },100)
      }
    }

    const getDataList = () => {
    
          const completeGenerateData = (rowlist_temp:any[]) => {
              setTimeout(()=>{
                setShowProgressBars(false);
                setShowSkeleton(false);
              }, 77)
              
              if (localStorage.getItem('data') == null)
              {
                localStorage.setItem('data', JSON.stringify(rowlist_temp))
              }

              setRowList([...rowlist_temp]);
              setStatusDone(true);
          }


          setStatusDone(false);
          setShowForm(false);

          setShowProgressBars(true);
          setShowSkeleton(true);
    
          // setRowList([
          //   {
          //     title:'halo',
          //     tag:['Baru', 'Teknologi', 'Sport']
          //   }
          // ])

          let count_finish:number = 0;
          let rowlist_temp:any[] = [];

          let dataStorage = localStorage.getItem("data");

          
          if (dataStorage === null) 
            {
              // Ekonomi
              // * Jika data kosong, maka isi dengan data default
              PPE_getApiSync(`https://api-berita-indonesia.vercel.app/antara/ekonomi`
                    ,null
                    , 'application/json'
                    , 'GET'
                    , null)
              .then((response)=>{
        
                  let response_success = response?.['success']; // error dari internal
                  let response_message = response?.['message'] // error dari api
        
                  if (typeof response_success != 'undefined' && response_success === false){
                      count_finish++;
                  }
                  else {
                      const data_posts = response?.['data']?.['posts'];
    
                      if (response_success === true && typeof data_posts !== 'undefined' &&
                          Array.isArray(data_posts))
                      {
                          let final_posts_temp:any[] = data_posts.map((obj, idx)=>{
                            return {
                              uuid: uuidv7(),
                              title: obj?.['title'],
                              description: obj?.['description'],
                              tanggal: format(new Date(obj?.['pubDate']),'yyyy-MM-dd'),
                              url_photo: obj?.['thumbnail'],
                              kategori: 'Ekonomi',
                              content: obj?.['description'],
                              tags: ['Ekonomi']
                            }
                          })
                          rowlist_temp = [...rowlist_temp, ...final_posts_temp];
                          count_finish++;
                        }
                  }
                      
                  if (count_finish === 2){
                      completeGenerateData(rowlist_temp);
                  }
              });
              
              // Olahraga
              PPE_getApiSync(`https://api-berita-indonesia.vercel.app/antara/olahraga`
                    ,null
                    , 'application/json'
                    , 'GET'
                    , null)
              .then((response)=>{
        
                  let response_success = response?.['success']; // error dari internal
                  let response_message = response?.['message'] // error dari api
        
                  if (typeof response_success != 'undefined' && response_success === false){
                      count_finish++;
                  }
                  else {
                      const data_posts = response?.['data']?.['posts'];
    
                      if (response_success === true && typeof data_posts !== 'undefined' &&
                          Array.isArray(data_posts))
                      {
                          let final_posts_temp:any[] = data_posts.map((obj, idx)=>{
                            return {
                              uuid: uuidv7(),
                              title: obj?.['title'],
                              description: obj?.['description'],
                              tanggal: format(new Date(obj?.['pubDate']),'yyyy-MM-dd'),
                              url_photo: obj?.['thumbnail'],
                              kategori: 'Olahraga',
                              content: obj?.['description'],
                              tags: ['Olahraga']
                            }
                          })
                          rowlist_temp = [...rowlist_temp, ...final_posts_temp];
                          count_finish++;
                        }
                  }
                      
                  if (count_finish === 2){
                      completeGenerateData(rowlist_temp);
                  }
              });
          }
          else {
            if (typeof dataStorage === 'string')
            {
              setRowList(JSON.parse(dataStorage));
            }

            setTimeout(()=>{
              setShowProgressBars(false);
              setShowSkeleton(false);
            },500)
          }

    }

     useEffect(()=>{
        setTimeout(()=>{
            getDataList();
        },150)
    
    },[])

    let columns = useMemo<MRT_ColumnDef<any>[]>(
      ()=> 
        [
          {
            accessorKey: 'title',
            header:'Title',
            filterFn:'fuzzy',
            grow:true
          },
          {
            accessorKey: 'description',
            header:'Description',
            filterVariant:'text',
            // filterSelectOptions:['tes@gmail.com'],
            filterFn:'fuzzy',
            grow:true,
            size: 300
            // Header: ({column}) => {
            //     return <span>{column.columnDef.header}</span>
            // },
            // muiTableHeadCellProps:{
            //   align:'left'
            // }
          },
          {
            accessorKey: 'tanggal',
            header:'Tanggal',
            filterVariant:'date',
            filterFn:'fuzzy',
            grow:true,
            Cell:({cell, row})=> {
                return (
                  <>
                    <span>{format(new Date(row.original?.['tanggal']),'dd MMMM yyyy')}</span>
                  </>
                )
            },
          },
          {
            accessorKey: 'url_photo',
            header:'URL Photo',
            filterFn:'fuzzy',
            grow:true
          },
          {
            accessorKey: 'kategori',
            header:'Kategori',
            filterFn:'fuzzy',
            grow:true
          },
          {
            accessorKey: 'tags',
            header:'Tags',
            filterFn:'fuzzy',
            grow:true,
            // muiTableBodyCellProps: ({cell}) => {
            //   return {
            //     sx:{
            //       whiteSpace:'normal',
            //       overflow:'hidden',
            //       overflowWrap:'break-word',
            //       wordWrap:'break-word',
            //       height:'auto'
            //     }
            //   }
            // },
            Cell:({cell})=> {
                  return (

                    <>
                      <div className='d-flex gap-1 flex-wrap'>
                          {
                              typeof cell.row.original?.tags !== 'undefined' &&
                              Array.isArray(cell.row.original?.tags) && 
                              cell.row?.original?.tags.map((value_tag, index)=>{
                                  return (
                                    <Tag key={`art-${index}`} value={value_tag} severity={`${Math.floor(value_tag.length % 3) === 0 ? 'warning': Math.floor(value_tag.length % 3) === 1 ? 'info' : 'success'}`}
                                        rounded
                                        // style={{
                                        //   margin: custom_cell?.align === 'center' ? '0 auto' :
                                        //           custom_cell?.align === 'left' ? '0 auto 0 0' :
                                        //           custom_cell?.align === 'right' ? '0 0 0 auto' : ''
                                        // }}
                                      ></Tag>
                                  )
                              })
                          }
                          {
                              typeof cell.row.original?.tags === 'string' &&
                              cell.row.original?.tags.split(',').length > 0 && (
                                cell.row.original?.tags.split(',').map((value_tag, index)=>{
                                  return (
                                    <Tag key={`art-${index}`} value={value_tag} severity={`${Math.floor(value_tag.length % 3) === 0 ? 'warning': Math.floor(value_tag.length % 3) === 1 ? 'info' : 'success'}`}
                                        rounded
                                      ></Tag>
                                  )
                                })
                              )
                          }
                      </div>
                    </>
                  )
            },
          },
          {
            accessorKey: 'content',
            header:'Content',
            filterFn:'fuzzy',
            grow:true,
            visibleInShowHideMenu:false
          },
          {
            accessorKey: 'uuid',
            header:'UUID',
            filterFn:'contains',
            grow:true,
            visibleInShowHideMenu: false
          },
          // {
          //   accessorKey: 'is_active',
          //   header:'Active',
          //   filterVariant:'checkbox',
          //   filterFn:'contains',
          //   grow:true,
          //   Cell: ({cell}) => {
          //     return (
          //       cell.row.original.is_active ? 
          //           (
          //             // <Chip color="success" label="Yes" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>
  
          //             <Chip color="success" label="Yes" size="small" className='d-flex justify-content-center align-items-center ' sx={{minWidth:'auto', color:'#56CA00', fontWeight:'500', height:'20px',
          //                   backgroundColor:'rgba(86,202,0,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
          //             }}/>
          //           ) : 
          //           (
          //             <Chip color="error" label="No" size="small" sx={{minWidth:'auto', color:'#FF4C51', fontWeight:'500', height:'20px',
          //                   backgroundColor:'rgba(255, 76, 81,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
          //             }}/>
  
          //             // <Chip color="error" label="No" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>
          //           )
          //       // <span>{cell.row.original.is_active ? 'Yes':'No'}</span>
          //     )
          //   }
          // },
        ],
      []
    )

  return (

    <div>
        {
          !showForm && (
              <div className='mb-4'>
                  <LocalizationProvider 
                    dateAdapter={AdapterDateFns}
                  >
                    <MaterialReactTable columns={columns} data={rowList} 
                            // enableColumnPinning
                            // manualPagination={true}  // record tidak berubah jika page berubah
                            paginationDisplayMode='pages'   // pages->tampilkan per nomor halaman (1,2,3,...)
                            muiPaginationProps={{
                              size:'medium',
                              color:'primary',
                              shape:'rounded',
                              variant:'outlined', 
                              // showRowsPerPage:true, // [5,10,15,All] show or not
                              rowsPerPageOptions:[{value:5, label:'5'},{value:10, label:'10'},{value:15, label:'15'},{value:rowList.length, label:'All'}],
                              // rowsPerPageOptions:[5,10,15],
                              showFirstButton:true,
                              showLastButton:true
                            }}
                            // onPaginationChange={setPagination}  // harus set 'state -> pagination' juga
                            // // rowCount={100} //you can tell the pagination how many rows there are in your back-end data

                            state={{
                              // pagination:pagination,
                              showAlertBanner: false,
                              showProgressBars: showProgressBars,
                              showSkeletons: showSkeleton
                            }}
                            // muiToolbarAlertBannerProps={{color:'error', children:'Network error'}}
                            // positionToolbarAlertBanner='top'

                            initialState={{
                                // columnPinning:{left:['mrt-row-actions','mrt-row-numbers']},
                                density:'comfortable',  // tinggi setiap row (spacious, comfortable, compact)
                                columnOrder:[
                                  'mrt-row-numbers',
                                  'title',
                                  'description',
                                  'mrt-row-actions',
                                ],
                                columnVisibility:{'uuid': false, 'content':false}
                            }}
                            
                            renderTopToolbarCustomActions={({table})=>{

                                const modalEventOutChange = ({tipe, value, form}) => {
                                    if (form == 'createUser') {
                                      if (tipe == 'close_modal'){
                                        setTimeout(()=>{
                                          // setShowModal(value);
                                        },5);
                                      }
                                      else if (tipe == 'close_after_success_save') {
                                        // setShowModal(value);
                                        // getDataList();
                                      }
                                    }
                                }

                                return (
                                  <Box>
                                      <div className='d-flex gap-1'>
                                          {
                                            // getValueFromLocalStorageFunc("IOT_IS_SPUSR") == "true" && (
                                                <Button color="info" onClick={()=>{toolbarButtonClick('Create','Create User')}} variant='contained'
                                                    className='d-flex justify-content-between' style={{paddingLeft:'5px', paddingRight:'10px'}} > 
                                                    <ControlPointRounded titleAccess='Create'/>
                                                    <span className='ms-1' title="Create">Create</span> 
                                                </Button>
                                            // )
                                          }

                                          <Button color="secondary" 
                                              onClick={()=>{getDataList()}} 
                                              variant='outlined'
                                              className='d-flex justify-content-center align-items-center' style={{paddingLeft:'5px', paddingRight:'5px', minWidth:'0'}} > 
                                              <Refresh titleAccess='Refresh' />
                                              {/* <span className='ms-1'>Refresh</span>  */}
                                          </Button>
                                      </div>

                                      {/* <ModalCreateUser par_show={showModal ?? false} title={modalTitle} status={modalStatus} 
                                                par_statusLoader={modalLoader}
                                                row={modalRow} 
                                                outChange={modalEventOutChange} /> */}
                                  </Box>
                                )
                            }}

                            enableFacetedValues // untuk filterVariant = 'multi-select' hanya terambil data unik otomatis

                            renderToolbarInternalActions={({table})=>{
                              return (
                                <Box>
                                    {/* <IconButton onClick={()=>window.print()}>
                                      <Print />
                                    </IconButton> */}
                                    <MRT_ToggleGlobalFilterButton table={table}/> 
                                    <MRT_ToggleFiltersButton table={table}/>
                                    <MRT_ShowHideColumnsButton table={table} />
                                    <MRT_ToggleDensePaddingButton table={table} />
                                    <MRT_ToggleFullScreenButton table={table} />
                                </Box>
                              )
                            }}

                            // custom if rows empty / kosong
                            renderEmptyRowsFallback={({table})=>{
                                return (
                                      <p style={{margin:0, fontFamily:'"Roboto", "Helvetica", "Arial",sans-serif', fontStyle:'italic',  letterSpacing:'0.00938em'
                                                , width:'100%', color:'rgba(0, 0, 0, 0.6)', lineHeight:'1.5'
                                                , textAlign:'center', paddingTop:'2rem', paddingBottom:'2rem'
                                                , fontWeight:400}}>No records to display</p>
                                )
                            }}

                            
                            muiTableBodyProps={{
                              // styling body data
                              sx:{
                                '& tr:nth-of-type(odd) > td':{
                                    backgroundColor:'aliceblue'
                                }
                              }
                            }}

                            muiTableBodyCellProps={{
                              // styling semua cell dalam body data
                              sx:{
                                // borderRight:'1px solid #e0e0e0'
                              }
                            }}

                            // enableRowSelection

                            enableTopToolbar={true} 
                            muiTopToolbarProps={{
                              // styling top Toolbar
                              sx:{
                                // background:'linear-gradient(45deg, darkcyan, white)'
                                boxShadow:'0px 1px 12px -7px grey inset',    // shadow inset toolbar di atas
                                paddingTop:'7px',
                                // borderBottom:'1px solid lightgrey'
                              }
                            }}
                            muiTableHeadCellProps={{
                              // styling head cell / nama column
                              sx:{
                                backgroundColor:'transparent',
                                textAlign:'left',
                                paddingTop:'10px',
                                paddingBottom:'10px',
                                display:'flex',
                                justifyContent:'center',
                              }
                            }}
                            
                            columnFilterDisplayMode='subheader'
                            enableColumnFilterModes   // fuzzy, contains, so on...
                            enableColumnOrdering
                            enableColumnResizing

                            enableRowNumbers
                            rowNumberDisplayMode='static' // row number follow sort or not (static = fix 1,2,3,..; original = flexible when sort 2,1,3,...)

                            enableRowActions={true}
                            positionActionsColumn='first'  // posisi row action di awal / akhir

                            displayColumnDefOptions={{
                                'mrt-row-numbers':{

                                  // Cell: ({staticRowIndex}) => {  // menyebabkan nomor ter-reset jadi 1 setiap page berubah
                                  //     return <span>{(staticRowIndex??0) + 1}</span>
                                  // },

                                  visibleInShowHideMenu:true, // show this column in "show/hide columns"
                                  enableHiding:true   // can hide or not menu "show/hide columns"
                                  // ,Cell:({cell, staticRowIndex})=>{
                                  //     console.log(cell)
                                  //     return (
                                  //       <span>{(staticRowIndex??0) + 1}</span>
                                  //     )
                                  // }
                                  , Header:'#'
                                },
                                'mrt-row-actions':{
                                  header:'Actions',
                                  size: 100
                                }
                              }
                            }
                            
                            
                            renderRowActions={({cell, row, table}) => {
                                // let cellContent = row.original?.['name']?.['firstName'];
                                // console.log("cellContent")
                                // console.log("ID : ", cell.row.id)
                                // console.log("Index : ", cell.row.index)
                                // console.log("Address : ", row.original?.['address'])
                                return (
                                  <div className='d-flex align-items-center gap-2'>
                                      <div className='ppe-icon-actions edit' title="Edit" onClick={()=>{toolbarButtonClick('Edit','Edit User', row)}}>
                                          <ModeEdit sx={{fill: 'mediumslateblue !important'}} />
                                      </div>

                                      <div className='ppe-icon-actions delete' title="Hapus" onClick={()=>{toolbarButtonClick('Delete','Delete User', row)}}>
                                          <DeleteForever sx={{fill: 'red !important'}}/>
                                      </div>

                                  </div>
                                )
                            }}
                      />
                  </LocalizationProvider>
              </div>
          )
        }

          <ToastContainer 
            draggable
            pauseOnHover
          />

          <Toast ref={toastProsesRef}
                    className='fit-toast-position'/>

          {
            showForm &&
            statusDone && (
                  <>
                    <FormTemplate 
                    
                        props={propConfig} 
                        // props={propConfig} 

                        style={{
                          show_border:true
                        }}

                        final_session={finalSession}
                        status={statusInput} 
                        edit_data={arrDataEdit}
                        inDataChange={inDataChangeState}
                        outDataChange={outChange}

                        inConfirmDialog={inConfirmDialog}
                        outConfirmDialog={outConfirmDialogHandle}

                        outBackTo={outBackTo}
                        outCancel={outCancel}
                        outSave={outSaveTo}
                    />
                </>
            )
          }
      </div>
    // </FormTemplateContextProv>
  )
}

export default ArticleList