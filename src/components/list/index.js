import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col , Modal, Button } from "antd";
import { queryLiveing } from "../../api/asset"
import flvjs from "flv.js";
import './index.less';

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {
  console.log({
    dataSource,
    customParams,
    dataId,
    deleteData
  })
  const width = customParams ? customParams.width : 600;
  const [modalVisible, setModalVisible] = useState(false);
  const [liveRes, setliveRes] = useState({});
  const [flvPlayerEl, setflvPlayerEl] = useState({});

  useEffect(() => {
    setModalVisible(true);
  }, [])

  useEffect(() => {
    handleClick()
  }, [modalVisible])

  let flvPlayer;

  const handleClick = async () => {
    let liveUrl
    try {
      const {data} = await queryLiveing(dataId)
      liveUrl = data.url;
      setliveRes(data)
      console.log("liveUrl===>",liveUrl);
    } catch (error) {
      console.log(error);
      liveUrl = "https://rtmp01open.ys7.com:9188/v3/openlive/D37888573_1_1.flv?expire=1657892839&id=468156632111525888&t=45e67cf14202a3b15f8dae5248c68fb247b8014fbc5bae910b07a666ea4523ba&ev=100";
    }

    if (flvjs.isSupported() && modalVisible == true && liveUrl) {
      var videoEl = document.getElementById('videoEl')
      flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: liveUrl,
      })
      flvPlayer.attachMediaElement(videoEl)
      flvPlayer.load()
      flvPlayer.play()
      setflvPlayerEl(flvPlayer)
    }
  }

  const destroyflvPlayer = () =>{
    // 直播断流
    console.log('flvPlayerEl',flvPlayerEl);
    flvPlayerEl.unload()
    flvPlayerEl.detachMediaElement()
    setflvPlayerEl({})
    setModalVisible(false)
  }

  return (
    <>
      <Modal title={liveRes.deviceName ? liveRes.deviceName : "直播弹窗"} visible={modalVisible} footer={null} destroyOnClose={true} onCancel={destroyflvPlayer} className="tranfer-table-filter-modal" width={width}>
        <video id="videoEl" className="modal_video" controls></video>
      </Modal>
    </> 
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
