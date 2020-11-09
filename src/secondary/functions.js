     /**
      * Capitalizes a string
      * @param {string} string 
      */
     function capitalize(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
     }
   
   /**
    * Removes specifed array element
    * @param {Array} arr
    * @param {*} value
    */
   function rmelement(arr, value) {
     var index = arr.indexOf(value);
     if (index > -1) {
       arr.splice(index, 1);
     }
     return arr;
   }
   
   /**
    * Trims array down to specified size
    * @param {Array} arr
    * @param {int} maxLen
    */
   function trimarray(arr, maxLen = 10) {
     if (arr.length > maxLen) {
       const len = arr.length - maxLen;
       arr = arr.slice(0, maxLen);
       arr.push(`and **${len}** more...`);
     }
     return arr;
   }
   
   /**
    * Trims joined array to specified size
    * @param {Array} arr
    * @param {int} maxLen
    * @param {string} joinChar
    */
   function trimstringfromarray(arr, maxLen = 2048, joinChar = '\n') {
     let string = arr.join(joinChar);
     const diff = maxLen - 15; // Leave room for "And ___ more..."
     if (string.length > maxLen) {
       string = string.slice(0, string.length - (string.length - diff)); 
       string = string.slice(0, string.lastIndexOf(joinChar));
       string = string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
     }
     return string;
   }
   
   /**
    * Gets current array window range
    * @param {Array} arr
    * @param {int} current
    * @param {int} interval
    */
   function getrange(arr, current, interval) {
     const max = (arr.length > current + interval) ? current + interval : arr.length;
     current = current + 1;
     const range = (arr.length == 1 || arr.length == current || interval == 1) ? `[${current}]` : `[${current} - ${max}]`;
     return range;
   }
   
   
   /**
    * Gets the ordinal numeral of a number
    * @param {int} number
    */
   function getordinal(number) {
     number = number.toString();
     if (number === '11' || number === '12' || number === '13') return number + 'th';
     if (number.endsWith(1)) return number + 'st';
     else if (number.endsWith(2)) return number + 'nd';
     else if (number.endsWith(3)) return number + 'rd';
     else return number + 'th';
   }
   
        const userping = /<@!?([0-9]{15,21})>/;
        const channelping = /<#([0-9]{15,21})>/;
        const roleping = /<@&([0-9]{15,21})>/;
   
   function removementions (message) {
        let matches;
    
        if (!message) return null;
   
        while ((matches = userping.exec(message)) !== null) {
          const user = this.message.channel.guild
            ? this.message.channel.guild.members.get(matches[1])
            : this.client.users.get(matches[1]);
    
          const formatted = user ? `@${user.nick || user.username}` : '@\u200Buser';
          message = message.replace(matches[0], formatted);
        }
    
        while ((matches = channelping.exec(message)) !== null) {
          const channel = this.message.channel.guild.channels.get(matches[1]);
          const formatted = channel ? `#${channel.name}` : '#\u200Bchannel';
          message = message.replace(matches[0], formatted);
        }
    
        while ((matches = roleping.exec(message)) !== null) {
          const role = this.message.channel.guild.roles.get(matches[1]);
          const formatted = role ? `@${role.name}` : '@\u200Brole';
          message = message.replace(matches[0], formatted);
        }
    
        message = message.replace('@everyone', '@\u200Beveryone')
          .replace('@here', '@\u200Bhere');
        
          return message;
   }
   
   function removeinvites (message) {
       if (!message) return null;
       let invregex = /discord(?:app\.com\/invite|\.gg)\/([a-z0-9]{1,16})/gi;
       const match = invregex.exec(message);
       if (match) {
         return message.replace(match[0], '**`Invite`**');
       } else {
         return message;
       }
     }
   
   function randominarray (array) {
     return array[Math.floor(Math.random() * array.length)];
   }
   
   function randomnumber (min, max) {
     if (!min || !max) {
       // Default 0-100 if no args passed
       min = 0;
       max = 100;
     }
     return Math.floor(Math.random() * (max - min + 1) + min);
   }
   
   function removeduplicates (array) {
     return Array.from(new Set(array).values());
   }
   
   function codeblock (str, lang) {
     return `${'```'}${lang || ''}\n${str}\n${'```'}`;
   }
   
   function gettime (time) {
     const methods = [
       { name: 'd', count: 86400 },
       { name: 'h', count: 3600 },
       { name: 'm', count: 60 },
       { name: 's', count: 1 }
     ];
   
     const timeStr = [ Math.floor(time / methods[0].count).toString() + methods[0].name ];
     for (let i = 0; i < 3; i++) {
       timeStr.push(Math.floor(time % methods[i].count / methods[i + 1].count).toString() + methods[i + 1].name);
     }
   
     return timeStr.filter(g => !g.startsWith('0')).join(', ');
   }
   
   
   function paginate (text, limit = 2000) {
     const lines = text.split('\n');
     const pages = [];
   
     let chunk = '';
   
     for (const line of lines) {
       if (chunk.length + line.length > limit && chunk.length > 0) {
         pages.push(chunk);
         chunk = '';
       }
   
       if (line.length > limit) {
         const lineChunks = line.length / limit;
   
         for (let i = 0; i < lineChunks; i++) {
           const start = i * limit;
           const end = start + limit;
           pages.push(line.slice(start, end));
         }
       } else {
         chunk += `${line}\n`;
       }
     }
   
     if (chunk.length > 0) {
       pages.push(chunk);
     }
   
     return pages;
   }
   
   function paginatearray (array, size) {
     let result = [];
     let j = 0;
     for (let i = 0; i < Math.ceil(array.length / (size || 10)); i++) {
       result.push(array.slice(j, j + (size || 10)));
       j = j + (size || 10);
     }
     return result;
   }
   
   module.exports = {
     capitalize,
     rmelement,
     trimarray,
     trimstringfromarray,
     getrange,
     getordinal,
     removeinvites,
     removementions,
     randominarray,
     randomnumber,
     removeduplicates,
     codeblock,
     gettime,
     paginate,
     paginatearray
   };