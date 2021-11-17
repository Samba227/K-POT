export class Frame{
  'id': number;
  'frame_time': string;
  'mac_source': string;
  'mac_dest': string;
  'ip_source': string;
  'ip_dest': string;
  'port_source': number;
  'port_dest': number;
  'packet_size': number;
  'protocol': string ;
  'flags': string[];
  constructor() {
  }
}
