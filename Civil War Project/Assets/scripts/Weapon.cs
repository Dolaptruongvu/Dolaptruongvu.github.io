using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Weapon : MonoBehaviour
{
    public GameObject bullet; // save bullet
    public Transform firePos; // where create bullet ( head of gun )
    public float TimeBtwFire = 0.2f;
    public float bulletForce;
    public GameObject muzzle;
    

    private float timeBtwFire;

    // Update is called once per frame
    void Update()
    {
        RotateGun();
        timeBtwFire -= Time.deltaTime;
        if (Input.GetMouseButton(0) && timeBtwFire < 0) // 0 is keycode, timebetweenfire < 0 
        {
            FireBullet();
        }
    }
    void RotateGun()
    {
        Vector3 mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition); // get mouse position
        Vector2 lookDir = mousePos - transform.position; // calculating the gun position to the mouse position
        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg; // calculating the angle of lookdir base on up down and left right of angle and change from rad to deg
        Quaternion rotation = Quaternion.Euler(0, 0, angle); // unity use quaternion with radian unit for rotation we can change it freedomly in interface , but in code we need to use quaternion
        transform.rotation = rotation;

        if(transform.eulerAngles.z >90 && transform.eulerAngles.z < 275)
        {
            transform.localScale = new Vector3((float)0.6051414, (float)-0.3766029, 1);
        }
        else {
            transform.localScale = new Vector3((float)0.6051414, (float)0.3766029, 1);
        }

    }
    void FireBullet()
    {
        timeBtwFire = TimeBtwFire;

        GameObject bulletTmp = Instantiate(bullet, firePos.position, Quaternion.identity); // create another bullet
        Instantiate(muzzle, firePos.position, transform.rotation, transform);

        Rigidbody2D rb = bulletTmp.GetComponent<Rigidbody2D>(); // get component ( get regidbody2d)  of temp bullet
        rb.AddForce(transform.right * bulletForce, ForceMode2D.Impulse); // add force following the x direction of object that firing ( direction force * bullet force ), impulse mean fire the bullet following to the direction obj point to


    }
}
