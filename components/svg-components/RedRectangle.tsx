import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = () => (
  <Svg width={24} height={24} fill="none">
    <Path
      fill="#E4607F"
      fillOpacity={0.76}
      d="M23.223 13.093 13.098 23.218a.838.838 0 0 1-1.186 0L1.788 13.093a.838.838 0 0 1 0-1.186l10.13-10.125a.838.838 0 0 1 1.185 0l10.125 10.13a.837.837 0 0 1-.005 1.18Z"
      opacity={0.2}
    />
    <Path
      fill="#E4607F"
      fillOpacity={0.76}
      d="M23.82 11.31 13.69 1.18a1.688 1.688 0 0 0-2.38 0L1.185 11.31a1.688 1.688 0 0 0 0 2.38l10.13 10.131a1.688 1.688 0 0 0 2.38 0l10.13-10.131a1.688 1.688 0 0 0 0-2.38h-.005ZM12.5 22.625 2.375 12.5 12.5 2.375 22.625 12.5 12.5 22.625Z"
    />
  </Svg>
)
export default SvgComponent
