import React, { useEffect, useState } from 'react'
import './article_dashboard.scss'
import { Neutron } from '../../../assets'
import storeMenu from '../../../stores'
import { format } from 'date-fns'
import idLocale from 'date-fns/locale/id'
import { useNavigate } from 'react-router'

const ArticleDashboard = () => {

  const navigate = useNavigate();

  const [dataArticle, setDataArticle] = useState<any[]>([]);
  const [dataArticleTop, setDataArticleTop] = useState<any[]>([]);
  const [dataArticlePopuler, setDataArticlePopuler] = useState<any[]>([]);
  const [dataTopic, setDataTopic] = useState<{[key:string]:any[]}>({}); // {'Ekonomi':[...], 'Olahraga':[...]}
  const [headline, setHeadline] = useState<any>({});
  
  useEffect(()=>{
    const getData = localStorage.getItem('data');

    
    if (typeof getData === 'string')
    {
        try {
          let getDataParse = JSON.parse(getData);
          
          
          const acak = Math.floor(Math.random() * getDataParse.length);
          if (typeof getDataParse?.[acak] !== 'undefined'){

              const data_headline = getDataParse?.[acak];
              const tanggal_id = format(new Date(data_headline?.['tanggal']), 'dd MMMM yyyy', {locale:idLocale});
              // alert(tanggal_id) 
              setHeadline({...data_headline,
                              'tanggal_id': tanggal_id
                          });

              // alert(JSON.stringify(data_headline, null,2))

          }

          getDataParse = getDataParse.map((obj, idx)=>{
            const tanggal_id = format(new Date(obj?.['tanggal']), 'dd MMMM yyyy', {locale:idLocale});
            return {
              ...obj,
              'tanggal_id':tanggal_id
            }
          })
          // alert(
          //   format(
          //         new Date(getDataParse[1]?.['tanggal'])
          //       ,'dd MMMM yyyy'
          //   , {locale: idLocale})
          // );

          setDataArticleTop(getDataParse.slice(0,6));

          let _temp_pop_random:any[] = [];
          for (let i=0; i<6;i++){
            const acak_pop = Math.floor(Math.random() * getDataParse.length);
            _temp_pop_random = [..._temp_pop_random, getDataParse?.[acak_pop]];
          }
          setDataArticlePopuler([..._temp_pop_random]);

          let _temp_arr_topic:any = {};
          if (Array.isArray(getDataParse) && getDataParse.length > 0){
            
            // Topic Ekonomi
            let findTopicEkonomi:any[] = getDataParse.filter((obj, idx)=>{
                                            if (typeof obj?.['kategori'] !== 'undefined' 
                                                && obj?.['kategori'] !== null
                                                && obj?.['kategori'] !== ''
                                                && obj?.['kategori'].toString().toUpperCase() === 'EKONOMI')
                                            {
                                              return true;
                                            }
                                            return false;
                                        })
            if (findTopicEkonomi.length > 0){
              findTopicEkonomi = findTopicEkonomi.sort((a,b)=>{
                if (a['tanggal'] < b['tanggal']){
                  return -1;
                }
                else if (a['tanggal'] > b['tanggal']){
                  return 1;
                }
                else return 0;
              }).reverse();

              _temp_arr_topic = {'Ekonomi': [...findTopicEkonomi].splice(0,10)}
              // setDataTopic({'Ekonomi': [...findTopicEkonomi].splice(0,10)}) // 10 data terakhir

            }

            // Topic Olahraga
            let findTopicOlahraga:any[] = getDataParse.filter((obj, idx)=>{
                if (typeof obj?.['kategori'] !== 'undefined' 
                    && obj?.['kategori'] !== null
                    && obj?.['kategori'] !== ''
                    && obj?.['kategori'].toString().toUpperCase() === 'OLAHRAGA')
                {
                  return true;
                }
                return false;
            })

            if (findTopicOlahraga.length > 0){
              findTopicOlahraga = findTopicOlahraga.sort((a,b)=>{
                if (a['tanggal'] < b['tanggal']){
                  return -1;
                }
                else if (a['tanggal'] > b['tanggal']){
                  return 1;
                }
                else return 0;
            }).reverse();

            if (Object.keys(_temp_arr_topic).length > 0)
            {
              _temp_arr_topic = {..._temp_arr_topic, 'Olahraga': [...findTopicOlahraga].splice(0,10)}
            }

            setDataTopic({..._temp_arr_topic})

            // setDataTopic({...dataTopic, 'Ekonomi': [...findTopicEkonomi].splice(0,10)}) // 10 data terakhir
          }
        }
                                      
        }catch(e){
          setDataArticleTop([]);
          setDataArticlePopuler([]);
        }

    }
    else {
      setDataArticleTop([]);
    }
  },[])

  useEffect(()=>{
    setTimeout(()=>{
      // dispatch icon title
      storeMenu.dispatch({type:'titleicon', text: 'Dashboard'})

      // dispatch breadcrumb path
      storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Article', value:'Article'}, {key:'Dashboard', value:'Dashboard'}]})
      
    },100)
  },[])

  const redirectToDetail = (obj) => {
    navigate({
      pathname:`/article/detail/${obj?.['uuid']}`
    })
  }

  return (
    <div className='d-flex justify-content-center'>
        <div className='ad-container'>
            <nav className='ad-nav'>
                <img src={Neutron} width={50} height={'auto'} />

                <span className='ad-title'>Artikel</span>
            </nav>

            <div className='mt-3'>
                <div className='ad-item-top'>
                    {
                        Array.isArray(dataArticleTop) && (
                          dataArticleTop.map((obj, idx)=>{
                            return (
                                <div key={`ad-top-${idx}`} className='ad-item-top-container'
                                      onClick={()=>redirectToDetail(obj)}
                              >
                                        <div className='ad-title-img'>
                                            <img src={`${obj?.['url_photo']}`} />
                                        </div>

                                        <div className='ad-title-text'>
                                            <h6>{obj?.['title']}</h6>
                                        </div>  
                                </div>  
                            )
                          })
                        )
                    } 

                </div>
            </div>
            
            {/* Big Scale */}
            <div className='mt-3'>
                  <div className='row'>

                        <div className='col-12 col-md-7'>
                            <div className='ad-headline'>
                                <div className='ad-headline-cover-image'
                                      onClick={()=>redirectToDetail(headline)}
                                >
                                    <img src={headline?.['url_photo']} />

                                    <div className='ad-headline-subtitle'>
                                        <h2>{headline?.['title']}</h2>
                                        <span className='ad-headline-time'>{headline?.['tanggal_id']}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                              {/* Topic */}
                                <div className='col-12 mt-3'>
                                      {
                                        Object.keys(dataTopic).length > 0 &&
                                        Object.keys(dataTopic).map((objTopic, idxTopic)=>{
                                          return (
                                              <div key={`ad-topic-key-${idxTopic}`} 
                                                  style={{
                                                    marginTop: idxTopic > 0 ? '30px' : '0'
                                                  }}
                                                >
                                                  {
                                                    idxTopic > 0 && (
                                                      <hr />
                                                    )
                                                  }

                                                  <h4 style={{color:'darkblue', fontFamily:'Nunito', fontWeight:700, fontSize:'22px'}}>
                                                        {objTopic}
                                                  </h4>

                                                  <div className='d-flex flex-column gap-3'>
                                                      {
                                                        typeof dataTopic?.[objTopic] !== 'undefined'
                                                        && dataTopic?.[objTopic].map((obj, idx)=>{
                                                          return (
                                                              <div key={`ad-topic-${idx}`} className='ad-topic-list d-flex align-items-start gap-3'
                                                                  onClick={()=>redirectToDetail(obj)}
                                                               >
                                                                  <img src={obj?.['url_photo']} style={{marginTop:'7px'}} width={150} height={100} />

                                                                  <div className='d-flex flex-column gap-2'>
                                                                      <div className='d-flex flex-column'>
                                                                        <span className='ad-title' style={{margin:0, padding:0}}>{obj?.['title']}</span>
                                                                        
                                                                        <span className='ad-content' style={{margin:0, padding:0}}>
                                                                            {/* dangerouslySetInnerHTML={{__html:`${obj?.['description']}`}}> */}
                                                                          {obj?.['description']}
                                                                          </span>
                                                                      </div>
                                                                      
                                                                      <div className='d-flex gap-2 align-items-center'>
                                                                          <span className='ad-topic-kategori' style={{margin:0, padding:0, fontSize:'14px', fontStyle:'normal'}}>{obj?.['kategori']}</span>

                                                                          <span style={{color:'grey'}}>|</span>

                                                                          <span className='ad-topic-tanggal' style={{margin:0, padding:0, fontSize:'14px', fontStyle:'normal'}}>{obj?.['tanggal_id']}</span>
                                                                      </div>
                                                                  </div>

                                                              </div>
                                                          )
                                                        })
                                                      }
                                                  </div>
                                              </div>
                                          )
                                        })
                                      }

                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-md-4 mt-3 mt-md-0'>
                              <hr className='line-hr-artikel-pop'/>
                              <h4 style={{color:'darkblue', fontFamily:'Nunito', fontWeight:700, fontSize:'22px'}}>
                                      Artikel Populer
                              </h4>
                              <div className='d-flex flex-column gap-3'>
                                  {
                                    dataArticlePopuler.map((obj, idx)=>{
                                      return (
                                          <div key={`ad-populer-${idx}`} className='ad-populer-list d-flex align-items-start gap-3'
                                                onClick={()=>redirectToDetail(obj)}
                                          >
                                              <img src={obj?.['url_photo']} style={{marginTop:'7px'}} width={150} height={100} />

                                              <div className='d-flex flex-column gap-2'>
                                                  <span className='ad-title' style={{margin:0, padding:0}}>{obj?.['title']}</span>

                                                  <span style={{margin:0, padding:0, fontSize:'12px', fontStyle:'italic'}}>{obj?.['tanggal_id']}</span>
                                              </div>

                                          </div>
                                      )
                                    })
                                  }
                              </div>
                        </div>
                  </div>
            </div>

        </div>
    </div>
  )
}

export default ArticleDashboard