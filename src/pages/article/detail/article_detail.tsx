import React, { useEffect, useState } from 'react'
import './article_detail.scss'
import { Neutron } from '../../../assets'
import storeMenu from '../../../stores'
import { format } from 'date-fns'
import idLocale from 'date-fns/locale/id'
import { useNavigate, useParams } from 'react-router'
import { Image } from 'primereact/image'
import { Button as ButtonPrime } from 'primereact/button'
import { IconField } from 'primereact/iconfield'

const ArticleDetail = () => {

  const [dataArticle, setDataArticle] = useState<any[]>([]);
  const [dataArticleTop, setDataArticleTop] = useState<any[]>([]);
  const [dataArticlePopuler, setDataArticlePopuler] = useState<any[]>([]);
  const [dataTopic, setDataTopic] = useState<{[key:string]:any[]}>({}); // {'Ekonomi':[...], 'Olahraga':[...]}
  const [detail, setDetail] = useState<any>({});

  const param = useParams();
  const navigate = useNavigate();
  
  useEffect(()=>{
    const getData = localStorage.getItem('data');

    
    if (typeof getData === 'string')
    {
        try {
            let getDataParse = JSON.parse(getData);
            if (getDataParse !== null && Array.isArray(getDataParse))
            {
                let findItem = getDataParse.find((obj, idx)=>obj?.['uuid'] === param?.['uuid']);
                if (findItem)
                {
                  
                  const tanggal_convert = new Date(findItem?.['tanggal']);
                  const format_tanggal = format(tanggal_convert, 'EEEE, dd MMMM yyyy', {locale:idLocale});
                  
                  setDetail({...findItem, 'tanggal_id':format_tanggal, 
                          'tags_arr': typeof findItem?.['tags'] === 'string' ? findItem?.['tags'].split(',') : findItem?.['tags']});

                }
                else {
                  outBackTo();
                }
            }
            else {
              outBackTo();
            }

        }catch(e){
        
        }

    }
    else {
      
    }
  },[])

  const outBackTo = () => {
    navigate({
      pathname:'/article/dashboard'
    })
  }

  useEffect(()=>{
    setTimeout(()=>{
      // dispatch icon title
      storeMenu.dispatch({type:'titleicon', text: 'Detail'})

      // dispatch breadcrumb path
      storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Article', value:'Article'}, {key:'Detail', value:'Detail'}]})
      
    },100)
  },[])

  return (
    <div className='d-flex flex-column gap-2'>

        <ButtonPrime style={{height:'38px', width:'140px', padding:'10px', boxShadow:'none', backgroundColor:'#092C4C', border:'transparent'}}
                onClick={outBackTo}
            >
                <IconField className='pi pi-arrow-left ' style={{marginLeft:'5px', marginRight:'10px', fontSize:'12px'}} />
                <span style={{fontSize:'14px',fontWeight:700, fontFamily:'Nunito'}}>Back to List</span>
        </ButtonPrime>

        <div className='ad-detail-container'>

            <div className='d-flex flex-column'>
                <h1 className='ad-detail-title'>{detail?.['title']}</h1>

                <div className='ad-detail-waktu'>
                  <strong>Tayang: </strong>
                  <time>{detail?.['tanggal_id']}</time>
                </div>
            </div>

            <div className='mt-3'>
              <Image src={detail?.['url_photo']} alt="Image" 
                      preview
                      // imageStyle={{borderRadius:`${typeof obj_input?.['shape'] === 'undefined' || obj_input?.['shape'] === null || obj_input?.['shape'] === 'circle' ? '50%':'0'}`}}
                      loading='lazy'
                      className='ad-detail-img'
                      
                      // className='fit-p-image-upload-preview-custom'
                      closeOnEscape={true}
                      />

                  {/* <img src={detail?.['url_photo']} className='ad-detail-img'/> */}
            </div>

            <div className='mt-3'>
                <div 
                    dangerouslySetInnerHTML={{__html: detail?.['content']}}>
                </div>
            </div>

            {/* Tags */}
            <div className='mt-5'>
                <div className='d-flex'>
                    <div className='ad-detail-tags-title'>
                        Tags
                        <i className='fa fa-tags ms-1' style={{color:'grey'}}/>
                    </div>

                    <div className='d-flex gap-2'>
                          {
                            typeof detail?.['tags_arr'] !== 'undefined' &&
                            detail?.['tags_arr'].length > 0 &&
                            detail?.['tags_arr'].map((tag, idx)=>{
                              return (
                                <h5 key={`ad-tags-${idx}`}>
                                  <span className='ad-tag-item'>{tag}</span>
                                </h5>
                              )
                            })
                          }
                    </div>
                    
                </div>
            </div>


        </div>
    </div>
  )
}

export default ArticleDetail