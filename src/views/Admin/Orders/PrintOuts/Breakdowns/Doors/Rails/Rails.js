import Cope_Door from './designs/Cope/Cope_Door'
import Miter_Door from './designs/Miter/Miter_Door'
import MT_Door from './designs/MT/MT_Door'

import Cope_DF from './designs/Cope/Coper_DF'
import Miter_DF from './designs/Miter/Miter_DF'
import MT_DF from './designs/MT/MT_DF'

import Face_Frame from './designs/Face_Frame/Face_Frame'
import One_Piece_Door from './designs/One_Piece_Door/One_Piece_Door'
import Slab_Door from './designs/Slab_Door/Slab_Door'
import Glass_Door from './designs/Glass/Glass'



export default (info, part, breakdowns) => {



  if(part.orderType.value === "Door") {
    if (part.construction.value === "Cope") {
      return Cope_Door(info, part, breakdowns[0])
    }
    if (part.construction.value === "MT") {
      return MT_Door(info, part, breakdowns[1])
    }
    if (part.construction.value === "M") {
      return Miter_Door(info, part, breakdowns[2])
    }

    if (part.construction.value === "Glass") {
      return Glass_Door(info, part, breakdowns[6])
    }

  }

  if(part.orderType.value === "DF") {
    if (part.construction.value === "Cope") {
      return Cope_DF(info, part, breakdowns[3])
    }
    if (part.construction.value === "MT") {
      return MT_DF(info, part, breakdowns[4])
    }
    if (part.construction.value === "M") {
      return Miter_DF(info, part, breakdowns[5])
    }

    if (part.construction.value === "Glass") {
      return Glass_Door(info, part, breakdowns[6])
    }

  }

  if(part.orderType.value === "Face_Frame") {
    return Face_Frame(info,part, breakdowns[6])
  }

  if(part.orderType.value === "One_Piece") {
    return One_Piece_Door()
  }

    
  if(part.orderType.value === "Slab_Door") {
    return Slab_Door(info)
  }




};
