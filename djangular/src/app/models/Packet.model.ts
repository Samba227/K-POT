export class Packet{
  'id': number;
  'frame_time': string;
  'frame_type': string;
  'mac_src': string;
  'mac_dst': string;
  'ip_src': string;
  'ip_dst': string;
  'port_src': number;
  'port_dst': number;
  'frame_len': number;
  'protocol': string ;
  'flags': number;
  constructor() {
  }
}
