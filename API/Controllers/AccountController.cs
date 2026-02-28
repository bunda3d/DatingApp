using System.Security.Cryptography;
using System.Text;
using API.Contracts;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // localhost:5001/api/account
    public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
    {
        // POST: api/account/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (!await IsEmailUnique(registerDto.Email.ToLower().Trim()))
            {
                return BadRequest("Email is already taken");
            }

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName.Trim(),
                Email = registerDto.Email.ToLower().Trim(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password.Trim())),
                PasswordSalt = hmac.Key
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            /* 
            var registeredUser = new UserDto
            {
                Id = user.Id.ToString(),
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = tokenService.CreateToken(user)
            }; */

            return Ok(user.ToUserDto(tokenService));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower().Trim());
            if (user == null) return Unauthorized("Invalid email or password");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password.Trim()));
            for (var i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            /* 
            var authedUser = new UserDto
            {
                Id = user.Id.ToString(),
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = tokenService.CreateToken(user)
            }; */

            return Ok(user.ToUserDto(tokenService));
        }

        private async Task<bool> IsEmailUnique(string email)
        {
            return !await context.Users.AnyAsync(x => x.Email == email);
        }
    }
}