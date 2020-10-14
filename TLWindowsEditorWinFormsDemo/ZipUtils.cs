using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TLWindowsEditorWinFormsDemo
{
    internal class ZipUtils
    {
        private const int ZIP_LEAD_BYTES = 0x04034b50;
        private const ushort GZIP_LEAD_BYTES = 0x8b1f;

        
        public static bool IsPkZipCompressedData(byte[] data)
        {
            // if the first 4 bytes of the array are the ZIP signature then it is compressed data
            return (BitConverter.ToInt32(data, 0) == ZIP_LEAD_BYTES);
        }

        public static bool IsGZipCompressedData(byte[] data)
        {
            // if the first 2 bytes of the array are theG ZIP signature then it is compressed data;
            return (BitConverter.ToUInt16(data, 0) == GZIP_LEAD_BYTES);
        }

        public static bool IsCompressedData(byte[] data)
        {
            return IsPkZipCompressedData(data) || IsGZipCompressedData(data);
        }

        public static byte[] GetInitBytes(Stream stream, int count)
        {
            stream.Seek(0, 0);

            try
            {
                byte[] bytes = new byte[count];

                stream.Read(bytes, 0, count);

                return bytes;
            }
            finally
            {
                stream.Seek(0, 0);  // set the stream back to the begining
            }
        }
    }
}
