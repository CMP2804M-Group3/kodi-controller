using System;

namespace kodiController
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            var kodi = new Controller();
            kodi.PlayPause();
        }
    }
}