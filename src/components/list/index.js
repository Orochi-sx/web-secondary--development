import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { queryAssetById } from '../../api/asset';
import { Modal } from "antd";
import "./index.less";
import { MenuOutlined } from '@ant-design/icons'


const List = ({ configuration }) => {
  const headerRef = useRef(null)
  const outBoxRef = useRef(null)
  const [config, setConfig] = useState({});
  const [asset, setAsset] = useState('85c18452-aced-4647-a387-5eacc7c90071')
  const [assetInfo, setAssetInfo] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modelConfig, setModelConfig] = useState({})
  const [donghua, setDonghua] = useState({})
  const [allLength, setAllLength] = useState(0)
  const [smallwidth, setSmallwidth] = useState(0)
  const [bigwidth, setBigwidth] = useState(0)
  const showModal = (title) => {

    let targetObject = assetInfo.filter(item => {
      return item.title === title
    })
    console.log('targetObject==', targetObject[0]);

    setModelConfig(targetObject[0])
    setIsModalVisible(true);

  };
  const handleOk = () => {
    setIsModalVisible(false);

  };

  const handleCancel = () => {
    setIsModalVisible(false);

  };
  // const hoverFn = () => {
  //   console.log(123);
  //   setDonghua({'animation-play-state':"paused"})


  // }
  const mouseEnter = () => {
    if (smallwidth > bigwidth) {
      let obj = {}
      obj['animation'] = `swiper ${allLength}s linear infinite`
      obj['animationPlayState'] = 'paused'
      setDonghua(obj)

    }
  }
  const mouseOut = () => {
    if (smallwidth > bigwidth) {
      let newobj = {}
      newobj['animation'] = `swiper ${allLength}s linear infinite`
      setDonghua(newobj)

    }



  }

  const getAssetsInfo = (id) => {
    queryAssetById(id).then(res => {
      console.log('res==', res);
      let headerList = []
      if (res.data.length) {
        res.data[0].forEach((item, index) => {
          headerList.push(item.col_name)
        })
        console.log('headerList==', headerList);
      }
      console.log(res.data[1]);
      let contentList = res.data[1]
      console.log('contentList==', contentList);
      let arr2 = []
      contentList.forEach((item, index) => {
        let obj = {}
        headerList.forEach((d, i) => {
          obj[d] = item[i]
        })
        arr2.push(obj)
      })

      arr2 = arr2.filter(item => {
        return item.notify_state === '已发布'
      })
      console.log(arr2);
      //无缝滚动的数据
      setAssetInfo(arr2)
      let contentWidth = headerRef.current.offsetWidth
      let outBoxWidth = outBoxRef.current.offsetWidth
      console.log(contentWidth);
      console.log(outBoxWidth);
      setSmallwidth(contentWidth)
      setBigwidth(outBoxWidth)
      if (contentWidth > outBoxWidth) {
        arr2.forEach(item => {
          arr2.push(item)
        })
        console.log('arr2????', arr2);
        const newList = [...arr2]
        setAssetInfo(newList)
        setAllLength(newList.length)
        setDonghua({
          animation: `swiper ${newList.length * 1}s linear infinite`
        })



      }

    })
  }
  useEffect(() => {
    getAssetsInfo(config.assetId ? config.assetId : asset)
  }, [])

  useEffect(() => {
    try {
      setConfig(JSON.parse(configuration || "{}"));
      console.log('>>>>>>>>>>>>>>>>', configuration);
      console.log();
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, [configuration]);
  return (
    <>    <div className="Header" ref={outBoxRef}


    >
      <div className="titleHeader" ref={headerRef} style={donghua} onMouseEnter={() => mouseEnter()} onMouseLeave={() => mouseOut()}>
        {assetInfo.map((item, index) => {
          return <div className="itemBox" key={index} onClick={() => showModal(item.title)}>
            <span>        <MenuOutlined style={{ color: 'green' }} /></span>
            <span>{item.title}</span>
          </div>
        })}
      </div>



    </div>
      <Modal title={modelConfig.title} bodyStyle={{ height: '400px' }} width="50%" footer={null} height="500px" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div className="bgBox" >
          <div className="titleSpan">
            {modelConfig.title}

          </div>
          <div className="contantArea">
            <div className="contantImg">
              <img src={require('../../assets/img/header.png').default} alt=""  />
            </div>
            <div className="contantText">
              {modelConfig.content}
            </div>
          </div>
          <div className="peopleBox">
            <div className="peopleBoxDetails">
              <span >{modelConfig.people}</span>
              <span style={{ "margin-left": '10px' }}>({modelConfig.address})</span>
              <span style={{ "margin-left": '10px' }}>{modelConfig.time}</span>
            </div>

          </div>

        </div>


      </Modal>

    </>

  )
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
